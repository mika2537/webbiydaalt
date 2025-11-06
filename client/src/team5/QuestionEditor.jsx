import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TYPE_LABELS = {
  mc: "Олон сонголттой",
  match: "Харгалзуулах",
  fill: "Нөхөх",
  open: "Нээлттэй хариулт",
};

const MODE_LABELS = {
  solve: "Шийдвэрлэх",
  remember: "Сэргэн санах",
};

function getYouTubeEmbed(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {}
  return null;
}

function getVimeoEmbed(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {}
  return null;
}

const QuestionEditor = () => {
  const { type, mode } = useParams();
  const navigate = useNavigate();

  const typeLabel = TYPE_LABELS[type] || "Тодорхойгүй төрөл";
  const modeLabel = MODE_LABELS[mode] || "Тодорхойгүй горим";

  const isValid = useMemo(() => TYPE_LABELS[type] && MODE_LABELS[mode], [type, mode]);

  // New: local states for image + video
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [questionText, setQuestionText] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [videoUrl, setVideoUrl] = useState("");

  const onPickImage = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    const objUrl = URL.createObjectURL(f);
    setImagePreview(objUrl);
  };

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  };

  const getVideoPreview = () => {
    if (!videoUrl) return null;
    const yt = getYouTubeEmbed(videoUrl);
    if (yt) {
      return (
        <iframe
          title="youtube-preview"
          className="w-full aspect-video rounded-md"
          src={yt}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
    const vimeo = getVimeoEmbed(videoUrl);
    if (vimeo) {
      return (
        <iframe
          title="vimeo-preview"
          className="w-full aspect-video rounded-md"
          src={vimeo}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    }
    // Fallback: try native <video> (e.g., direct .mp4 link)
    return (
      <video className="w-full rounded-md" controls src={videoUrl}>
        Танай хөтөч видеог тоглуулах боломжгүй байна.
      </video>
    );
  };

  if (!isValid) {
    return (
      <div className="p-6">
        <p className="text-red-600">Буруу сонголт байна. Төрөл/горим таарахгүй байна.</p>
        <button
          onClick={() => navigate("/team5/edit")}
          className="mt-3 text-orange-700 hover:underline"
        >
          Засварлах руу буцах
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{typeLabel}</h2>
          <p className="text-gray-600">Горим: {modeLabel}</p>
        </div>
        <button
          onClick={() => navigate("/team5/edit")}
          className="text-sm text-orange-700 hover:underline"
        >
          Бүх засварлагч
        </button>
      </div>

      {/* Засварлагчийн гол хэсэг */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <p className="text-gray-700">
          Засварлагч: <span className="font-medium">{typeLabel}</span> —{" "}
          <span className="font-medium">{modeLabel}</span>
        </p>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border rounded-md px-3 py-2"
            placeholder="Гарчиг"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="border rounded-md px-3 py-2"
            placeholder="Ангилал / Сэдэв"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <textarea
            className="md:col-span-2 border rounded-md px-3 py-2 min-h-28"
            placeholder="Асуултын текст"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
        </div>

        {/* --- New: Media attachments under 'Асуултын текст' --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Зураг нэмэх */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Зураг нэмэх (сонгох)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={onPickImage}
                className="block w-full text-sm file:mr-3 file:py-2 file:px-3
                           file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700
                           hover:file:bg-gray-200"
              />
              {imagePreview && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="px-3 py-2 rounded-md border text-sm hover:bg-gray-50"
                >
                  Цэвэрлэх
                </button>
              )}
            </div>

            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="question-attachment"
                  className="max-h-56 rounded-md border"
                />
              </div>
            )}
          </div>

          {/* Видео холбоос */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Видео холбоос (YouTube / Vimeo / MP4)
            </label>
            <input
              className="w-full border rounded-md px-3 py-2"
              placeholder="Ж: https://youtu.be/xxxxxx эсвэл https://example.com/video.mp4"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value.trim())}
            />
            {videoUrl && <div className="mt-3">{getVideoPreview()}</div>}
          </div>
        </div>
        {/* --- end media attachments --- */}

        <div className="flex gap-2 pt-2">
          <button className="px-4 py-2 bg-orange-600 text-white rounded-md">Хадгалах</button>
          <button className="px-4 py-2 border border-gray-300 rounded-md">Урьдчилан харах</button>
        </div>
      </div>
    </div>
  );
};

export default QuestionEditor;
