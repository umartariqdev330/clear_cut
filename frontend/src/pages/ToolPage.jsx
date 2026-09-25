import { useMemo, useState, useRef, useCallback } from 'react'
import {
  Upload,
  X,
  Download,
  Loader2,
  ImageIcon,
  Palette,
  Image as ImageLucide,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import './ToolPage.css'

const PRESET_COLORS = [
  '#ffffff', '#000000', '#ff6b6b', '#ffc048',
  '#00d2a0', '#6c5ce7', '#0984e3', '#e84393',
]

export default function ToolPage() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState(null)
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  // Background options
  const [replaceBg, setReplaceBg] = useState(false)
  const [bgType, setBgType] = useState('solid')
  const [color, setColor] = useState('#ffffff')
  const [bgFile, setBgFile] = useState(null)
  const [bgPreviewUrl, setBgPreviewUrl] = useState(null)

  // Compare slider
  const [comparePosition, setComparePosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef(null)
  const bgFileInputRef = useRef(null)
  const compareRef = useRef(null)

  const canSubmit = useMemo(() => !!file && !processing, [file, processing])

  const resetAll = () => {
    setFile(null)
    setPreviewUrl(null)
    setResultUrl(null)
    setError(null)
    setReplaceBg(false)
    setBgType('solid')
    setColor('#ffffff')
    setBgFile(null)
    setBgPreviewUrl(null)
    setComparePosition(50)
  }

  const onSelectFile = (selected) => {
    if (!selected) return
    setFile(selected)
    setResultUrl(null)
    setError(null)
    const url = URL.createObjectURL(selected)
    setPreviewUrl(url)
  }

  const onFileInput = (e) => {
    const selected = e.target.files?.[0]
    onSelectFile(selected)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files?.[0]
    if (dropped && dropped.type.startsWith('image/')) {
      onSelectFile(dropped)
    }
  }

  const onDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const onDragLeave = () => setDragOver(false)

  const onSelectBgFile = (e) => {
    const selected = e.target.files?.[0]
    setBgFile(selected || null)
    if (selected) {
      setBgPreviewUrl(URL.createObjectURL(selected))
    } else {
      setBgPreviewUrl(null)
    }
  }

  const onProcess = async () => {
    if (!file) return
    setProcessing(true)
    setResultUrl(null)
    setError(null)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('replace_bg', String(replaceBg))
      if (replaceBg) {
        form.append('bg_type', bgType)
        if (bgType === 'solid') {
          form.append('color', color)
        } else if (bgType === 'image' && bgFile) {
          form.append('bg_image', bgFile)
        }
      }

      const res = await fetch('/api/remove', {
        method: 'POST',
        body: form,
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.detail || 'Processing failed')
      }
      const blob = await res.blob()
      const fileObj = new File([blob], 'clearcut_result.png', { type: 'image/png' })
      const url = URL.createObjectURL(fileObj)
      setResultUrl(url)
    } catch (err) {
      setError(err.message || 'Failed to process image')
    } finally {
      setProcessing(false)
    }
  }

  // Compare slider handlers
  const handleCompareMove = useCallback((clientX) => {
    if (!compareRef.current) return
    const rect = compareRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setComparePosition(percent)
  }, [])

  const handleMouseDown = () => setIsDragging(true)

  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  const handleMouseMove = useCallback((e) => {
    if (isDragging) handleCompareMove(e.clientX)
  }, [isDragging, handleCompareMove])

  const handleTouchMove = useCallback((e) => {
    handleCompareMove(e.touches[0].clientX)
  }, [handleCompareMove])

  return (
    <div className="tool-page">
      <div className="container tool-page__inner">
        {/* Header */}
        <div className="tool-page__header animate-fade-in-up">
          <h1 className="tool-page__title">
            <Sparkles size={28} className="tool-page__title-icon" />
            Background Remover
          </h1>
          <p className="tool-page__subtitle">
            Upload an image and let AI do the magic. Download with transparent or custom backgrounds.
          </p>
        </div>

        <div className="tool-page__layout">
          {/* Left Panel — Upload + Settings */}
          <aside className="tool-panel animate-fade-in-up delay-1">
            <div className="tool-panel__section">
              <h3 className="tool-panel__label">Upload Image</h3>
              {!file ? (
                <div
                  className={`dropzone ${dragOver ? 'dropzone--active' : ''}`}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  id="dropzone"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onFileInput}
                    className="sr-only"
                    id="file-input"
                  />
                  <div className="dropzone__icon">
                    <Upload size={28} />
                  </div>
                  <p className="dropzone__text">
                    Drag & drop your image here
                  </p>
                  <p className="dropzone__hint">or click to browse · PNG, JPG, WebP</p>
                </div>
              ) : (
                <div className="file-preview">
                  <div className="file-preview__thumb">
                    <img src={previewUrl} alt="Preview" />
                  </div>
                  <div className="file-preview__info">
                    <p className="file-preview__name">{file.name}</p>
                    <p className="file-preview__size">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button className="file-preview__remove" onClick={resetAll} aria-label="Remove file" id="remove-file-btn">
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Background Settings */}
            <div className="tool-panel__section">
              <h3 className="tool-panel__label">Background</h3>
              <div className="bg-toggle">
                <button
                  className={`bg-toggle__btn ${!replaceBg ? 'bg-toggle__btn--active' : ''}`}
                  onClick={() => setReplaceBg(false)}
                  id="bg-transparent-btn"
                >
                  <ImageIcon size={16} />
                  Transparent
                </button>
                <button
                  className={`bg-toggle__btn ${replaceBg ? 'bg-toggle__btn--active' : ''}`}
                  onClick={() => setReplaceBg(true)}
                  id="bg-replace-btn"
                >
                  <Palette size={16} />
                  Replace
                </button>
              </div>

              {replaceBg && (
                <div className="bg-options animate-scale-in">
                  <div className="bg-type-tabs">
                    <button
                      className={`bg-type-tab ${bgType === 'solid' ? 'bg-type-tab--active' : ''}`}
                      onClick={() => setBgType('solid')}
                      id="bg-solid-tab"
                    >
                      Solid Color
                    </button>
                    <button
                      className={`bg-type-tab ${bgType === 'image' ? 'bg-type-tab--active' : ''}`}
                      onClick={() => setBgType('image')}
                      id="bg-image-tab"
                    >
                      Custom Image
                    </button>
                  </div>

                  {bgType === 'solid' ? (
                    <div className="color-picker">
                      <div className="color-presets">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c}
                            className={`color-swatch ${color === c ? 'color-swatch--active' : ''}`}
                            style={{ background: c }}
                            onClick={() => setColor(c)}
                            aria-label={`Select color ${c}`}
                          />
                        ))}
                      </div>
                      <div className="color-custom">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="color-input"
                          id="custom-color-input"
                        />
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="color-hex"
                          maxLength={7}
                          id="hex-input"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-image-upload">
                      <input
                        ref={bgFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={onSelectBgFile}
                        className="sr-only"
                        id="bg-file-input"
                      />
                      <button
                        className="bg-image-upload__btn"
                        onClick={() => bgFileInputRef.current?.click()}
                        id="bg-image-browse-btn"
                      >
                        <ImageLucide size={18} />
                        {bgFile ? bgFile.name : 'Choose background image'}
                      </button>
                      {bgPreviewUrl && (
                        <div className="bg-image-upload__preview">
                          <img src={bgPreviewUrl} alt="Background preview" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="tool-panel__actions">
              <button
                className="btn btn--primary btn--full"
                disabled={!canSubmit}
                onClick={onProcess}
                id="process-btn"
              >
                {processing ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    {replaceBg ? 'Change Background' : 'Remove Background'}
                  </>
                )}
              </button>

              {resultUrl && (
                <>
                  <button
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = resultUrl
                      link.download = 'clearcut_result.png'
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }}
                    className="btn btn--success btn--full"
                    id="download-btn"
                  >
                    <Download size={18} />
                    Download PNG
                  </button>
                  <button className="btn btn--ghost btn--full" onClick={resetAll} id="reset-btn">
                    <RotateCcw size={16} />
                    Start Over
                  </button>
                </>
              )}
            </div>

            {error && (
              <div className="tool-alert tool-alert--error animate-scale-in">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}
          </aside>

          {/* Right Panel — Canvas / Result */}
          <main className="tool-canvas animate-fade-in-up delay-2">
            {!previewUrl && !resultUrl && (
              <div className="tool-canvas__empty">
                <div className="tool-canvas__empty-icon">
                  <ImageIcon size={48} />
                </div>
                <p className="tool-canvas__empty-text">
                  Your image preview will appear here
                </p>
                <p className="tool-canvas__empty-hint">
                  Upload an image to get started
                </p>
              </div>
            )}

            {processing && (
              <div className="tool-canvas__processing">
                <div className="processing-spinner">
                  <Loader2 size={40} className="spin" />
                </div>
                <p className="processing-text">
                  {replaceBg ? 'Changing background...' : 'Removing background...'}
                </p>
                <p className="processing-hint">This usually takes a few seconds</p>
              </div>
            )}

            {resultUrl && previewUrl && !processing && (
              <div className="tool-canvas__result">
                <div className="result-badge animate-scale-in">
                  <CheckCircle2 size={16} />
                  {replaceBg ? 'Background Changed Successfully' : 'Background Removed Successfully'}
                </div>
                <div
                  ref={compareRef}
                  className="compare-slider"
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleMouseDown}
                  onTouchEnd={handleMouseUp}
                  onTouchMove={handleTouchMove}
                  id="compare-slider"
                >
                  {/* Checkerboard bg for transparent */}
                  <div className="compare-slider__layer compare-slider__checkerboard">
                    <img src={resultUrl} alt="Result" />
                  </div>
                  <div
                    className="compare-slider__layer compare-slider__original"
                    style={{ clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }}
                  >
                    <img src={previewUrl} alt="Original" />
                  </div>
                  <div
                    className="compare-slider__handle"
                    style={{ left: `${comparePosition}%` }}
                  >
                    <div className="compare-slider__handle-line" />
                    <div className="compare-slider__handle-knob">
                      <ZoomOut size={12} />
                      <ZoomIn size={12} />
                    </div>
                  </div>
                  <div className="compare-slider__labels">
                    <span className="compare-slider__label">Original</span>
                    <span className="compare-slider__label">Result</span>
                  </div>
                </div>
              </div>
            )}

            {previewUrl && !resultUrl && !processing && (
              <div className="tool-canvas__preview">
                <img src={previewUrl} alt="Upload preview" className="tool-canvas__image" />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
