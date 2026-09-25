from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
from PIL import Image, ImageOps
import io
import onnxruntime as ort


app = FastAPI(title="Image Background Remover API")

# Allow local dev origins; adjust for production as needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


providers = ort.get_available_providers()
use_gpu = "CUDAExecutionProvider" in providers


@app.get("/health")
def health() -> JSONResponse:
    return JSONResponse({
        "status": "ok",
        "gpu": use_gpu,
        "providers": providers,
    })


@app.post("/remove")
async def remove_background(
    file: UploadFile = File(...),
    replace_bg: bool = Form(False),
    bg_type: str | None = Form(None),  # "solid" | "image"
    color: str | None = Form(None),    # e.g. "#ffffff"
    bg_image: UploadFile | None = File(None),
):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")

    try:
        result_img = remove(image).convert("RGBA")
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to remove background")

    final_img = result_img

    if replace_bg:
        background = None
        if bg_type == "solid" and color:
            try:
                background = Image.new("RGBA", result_img.size, color)
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid color value")
        elif bg_type == "image" and bg_image is not None:
            try:
                bg_bytes = await bg_image.read()
                background = Image.open(io.BytesIO(bg_bytes)).convert("RGBA")
                background = ImageOps.fit(background, result_img.size)
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid background image")

        if background is not None:
            final_img = Image.alpha_composite(background, result_img)

    buf = io.BytesIO()
    final_img.save(buf, format="PNG")
    buf.seek(0)
    headers = {
        "Content-Disposition": "attachment; filename=clearcut_result.png"
    }
    return StreamingResponse(buf, media_type="image/png", headers=headers)


# For local run: uvicorn backend.main:app --reload

