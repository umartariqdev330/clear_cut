import streamlit as st
from rembg import remove
from PIL import Image, ImageOps
import io
import onnxruntime as ort

# Detect GPU availability
providers = ort.get_available_providers()
use_gpu = "CUDAExecutionProvider" in providers

st.set_page_config(page_title="Image Background Remover", page_icon="🖼️", layout="centered")
st.title("🖼️ Image Background Remover")

# Status message about GPU/CPU
if use_gpu:
    st.success("✅ GPU detected: Using CUDAExecutionProvider")
else:
    st.warning("⚠ No GPU detected: Falling back to CPUExecutionProvider")

# --- Session State for Processed Image ---
if "result_img" not in st.session_state:
    st.session_state.result_img = None

# Image Upload
uploaded_file = st.file_uploader("Upload an image", type=["png", "jpg", "jpeg"])

if uploaded_file:
    image = Image.open(uploaded_file).convert("RGBA")
    st.image(image, caption="Original Image", use_container_width=True)

    # Remove Background Button
    if st.button("Remove Background"):
        with st.spinner("Processing... Please wait"):
            result_img = remove(image)  
            st.session_state.result_img = result_img.convert("RGBA")  # Save to session state

# --- Show Result if Available ---
if st.session_state.result_img:
    result_img = st.session_state.result_img

    # Background Replace Toggle
    replace_bg = st.toggle("Replace Background?")
    if replace_bg:
        bg_option = st.radio("Choose background type:", ["Solid Color", "Custom Image"])

        if bg_option == "Solid Color":
            color = st.color_picker("Pick a background color", "#ffffff")
            bg = Image.new("RGBA", result_img.size, color)
        else:
            bg_file = st.file_uploader("Upload background image", type=["png", "jpg", "jpeg"], key="bg")
            if bg_file:
                bg = Image.open(bg_file).convert("RGBA")
                bg = ImageOps.fit(bg, result_img.size)

        if 'bg' in locals():
            final_img = Image.alpha_composite(bg, result_img)
        else:
            final_img = result_img
    else:
        final_img = result_img

    # Show and Download
    st.image(final_img, caption="Edited Image", use_container_width=True)
    buf = io.BytesIO()
    final_img.save(buf, format="PNG")
    st.download_button(
        label="Download Image",
        data=buf.getvalue(),
        file_name="background_removed.png",
        mime="image/png"
    )
