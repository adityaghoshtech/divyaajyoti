"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

type MaterialType =
  | "RECORDED_CLASS"
  | "LIVE_CLASS"
  | "PDF"
  | "NOTE"
  | "RESOURCE";

type Course = {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  status?: string;
};

type Material = {
  _id: string;
  courseSlug: string;
  title: string;
  type: string;
  description?: string;
  url?: string | null;
  storageId?: string | null;
  storageUrl?: string | null;
  sortOrder: number;
  status: string;
  createdAt: number;
  updatedAt?: number;
};

export default function CourseMaterialsAdminPage() {
  /* =========================================================
     DATA
  ========================================================= */

  const courses = useQuery(api.courses.list, {});

  const [selectedCourse, setSelectedCourse] =
    useState("");

  const materials = useQuery(
    api.courseMaterials.list,
    selectedCourse
      ? {
          courseSlug: selectedCourse,
          includeDrafts: true,
        }
      : "skip"
  );

  /* =========================================================
     MUTATIONS
  ========================================================= */

  const generateUploadUrl = useMutation(
    api.courseMaterials.generateUploadUrl
  );

  const createMaterial = useMutation(
    api.courseMaterials.create
  );

  const updateMaterial = useMutation(
    api.courseMaterials.update
  );

  const removeMaterial = useMutation(
    api.courseMaterials.remove
  );

  /* =========================================================
     FORM
  ========================================================= */

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [type, setType] =
    useState<MaterialType>("RECORDED_CLASS");

  const [externalUrl, setExternalUrl] =
    useState("");

  const [file, setFile] =
    useState<File | null>(null);

  const [status, setStatus] =
    useState("published");

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /* =========================================================
     SELECT FIRST COURSE
  ========================================================= */

  useEffect(() => {
    if (
      !selectedCourse &&
      courses &&
      courses.length > 0
    ) {
      setSelectedCourse(courses[0].slug);
    }
  }, [courses, selectedCourse]);

  /* =========================================================
     SELECTED COURSE
  ========================================================= */

  const currentCourse = useMemo(() => {
    if (!courses || !selectedCourse) {
      return null;
    }

    return courses.find(
      (course: Course) =>
        course.slug === selectedCourse
    );
  }, [courses, selectedCourse]);

  /* =========================================================
     RESET
  ========================================================= */

  function resetForm() {
    setTitle("");
    setDescription("");
    setType("RECORDED_CLASS");
    setExternalUrl("");
    setFile(null);
    setStatus("published");

    const input =
      document.getElementById(
        "material-file"
      ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  }

  /* =========================================================
     UPLOAD FILE
  ========================================================= */

  async function uploadFileToConvex(
    selectedFile: File
  ) {
    const uploadUrl =
      await generateUploadUrl();

    const result = await fetch(
      uploadUrl,
      {
        method: "POST",
        headers: {
          "Content-Type":
            selectedFile.type ||
            "application/octet-stream",
        },
        body: selectedFile,
      }
    );

    if (!result.ok) {
      throw new Error(
        "File upload failed."
      );
    }

    const data = await result.json();

    if (!data.storageId) {
      throw new Error(
        "Convex did not return a storage ID."
      );
    }

    return String(data.storageId);
  }

  /* =========================================================
     CREATE MATERIAL
  ========================================================= */

  async function handleCreate(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!selectedCourse) {
      setError(
        "Please select a course."
      );
      return;
    }

    if (!title.trim()) {
      setError(
        "Please enter a material title."
      );
      return;
    }

    const requiresFile =
      type === "RECORDED_CLASS" ||
      type === "PDF" ||
      type === "NOTE";

    const requiresUrl =
      type === "LIVE_CLASS" ||
      type === "RESOURCE";

    if (
      requiresFile &&
      !file &&
      !externalUrl.trim()
    ) {
      setError(
        "Please upload a file or provide an external URL."
      );
      return;
    }

    if (
      requiresUrl &&
      !externalUrl.trim()
    ) {
      setError(
        "Please enter the link."
      );
      return;
    }

    try {
      setUploading(true);

      let storageId:
        | string
        | undefined;

      /*
       * Upload local file to Convex Storage.
       */
      if (file) {
        storageId =
          await uploadFileToConvex(file);
      }

      const existingCount =
        materials?.length || 0;

      await createMaterial({
        courseSlug: selectedCourse,
        title: title.trim(),
        type,
        description:
          description.trim() ||
          undefined,
        url:
          externalUrl.trim() ||
          undefined,
        storageId,
        sortOrder:
          existingCount + 1,
        status,
      });

      setMessage(
        "Course material published successfully."
      );

      resetForm();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while uploading."
      );
    } finally {
      setUploading(false);
    }
  }

  /* =========================================================
     DELETE
  ========================================================= */

  async function handleDelete(
    id: string,
    materialTitle: string
  ) {
    const confirmed =
      window.confirm(
        `Delete "${materialTitle}"? This cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await removeMaterial({
        id: id as any,
      });

      setMessage(
        "Material deleted successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete material."
      );
    }
  }

  /* =========================================================
     TOGGLE STATUS
  ========================================================= */

  async function handleToggleStatus(
    material: Material
  ) {
    try {
      const nextStatus =
        material.status === "published"
          ? "draft"
          : "published";

      await updateMaterial({
        id: material._id as any,
        title: material.title,
        type: material.type,
        status: nextStatus,
        sortOrder: material.sortOrder,
      });

      setMessage(
        nextStatus === "published"
          ? "Material published."
          : "Material moved to draft."
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update material."
      );
    }
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (courses === undefined) {
    return (
      <>
        <div className="dj-admin-loading">
          Loading courses...
        </div>

        <AdminMaterialStyles />
      </>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      <main className="dj-material-page">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="dj-material-header">

          <div>

            <div className="dj-material-eyebrow">
              DIVYAJYOTI ADMIN
            </div>

            <h1>
              Course Materials
            </h1>

            <p>
              Upload and manage recorded classes,
              PDFs, notes, live classes and other
              learning resources.
            </p>

          </div>

          <div className="dj-material-header-badge">
            CONTENT MANAGER
          </div>

        </section>

        {/* =================================================
            COURSE SELECTOR
        ================================================= */}

        <section className="dj-material-course-selector">

          <div className="dj-material-selector-copy">

            <span>
              SELECT COURSE
            </span>

            <strong>
              Choose the course you want to manage.
            </strong>

          </div>

          <select
            value={selectedCourse}
            onChange={(event) =>
              setSelectedCourse(
                event.target.value
              )
            }
          >

            <option value="">
              Select a course
            </option>

            {courses.map(
              (course: Course) => (
                <option
                  key={course._id}
                  value={course.slug}
                >
                  {course.title}
                </option>
              )
            )}

          </select>

        </section>

        {/* =================================================
            MESSAGES
        ================================================= */}

        {message && (
          <div className="dj-material-success">
            <span>✓</span>
            {message}
          </div>
        )}

        {error && (
          <div className="dj-material-error">
            <span>!</span>
            {error}
          </div>
        )}

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="dj-material-grid">

          {/* =================================================
              UPLOAD FORM
          ================================================= */}

          <section className="dj-material-card">

            <div className="dj-material-card-header">

              <div>

                <span>
                  ADD CONTENT
                </span>

                <h2>
                  Upload course material
                </h2>

              </div>

              {currentCourse && (
                <div className="dj-material-current-course">
                  {currentCourse.title}
                </div>
              )}

            </div>

            <form
              onSubmit={handleCreate}
              className="dj-material-form"
            >

              {/* TITLE */}

              <div className="dj-field">

                <label>
                  Material title
                </label>

                <input
                  type="text"
                  placeholder="Example: Introduction to Predictive Astrology"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                />

              </div>

              {/* TYPE */}

              <div className="dj-field">

                <label>
                  Material type
                </label>

                <select
                  value={type}
                  onChange={(event) =>
                    setType(
                      event.target
                        .value as MaterialType
                    )
                  }
                >

                  <option value="RECORDED_CLASS">
                    Recorded Class Video
                  </option>

                  <option value="LIVE_CLASS">
                    Live Class / Google Meet
                  </option>

                  <option value="PDF">
                    PDF
                  </option>

                  <option value="NOTE">
                    Notes
                  </option>

                  <option value="RESOURCE">
                    Resource / Link
                  </option>

                </select>

              </div>

              {/* DESCRIPTION */}

              <div className="dj-field">

                <label>
                  Description
                  <span>
                    Optional
                  </span>
                </label>

                <textarea
                  rows={4}
                  placeholder="Short description about this class or material..."
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                />

              </div>

              {/* FILE */}

              {(type ===
                "RECORDED_CLASS" ||
                type === "PDF" ||
                type === "NOTE") && (
                <div className="dj-field">

                  <label>
                    Upload file
                  </label>

                  <label
                    htmlFor="material-file"
                    className="dj-file-drop"
                  >

                    <div className="dj-file-icon">
                      ↑
                    </div>

                    <strong>
                      {file
                        ? file.name
                        : "Choose a file"}
                    </strong>

                    <span>
                      {file
                        ? `${(
                            file.size /
                            1024 /
                            1024
                          ).toFixed(2)} MB`
                        : type ===
                          "RECORDED_CLASS"
                        ? "Upload MP4, WebM or other video file"
                        : "Upload PDF or document"}
                    </span>

                    <input
                      id="material-file"
                      type="file"
                      accept={
                        type ===
                        "RECORDED_CLASS"
                          ? "video/*"
                          : type === "PDF"
                          ? ".pdf,application/pdf"
                          : ".pdf,.doc,.docx,.txt"
                      }
                      onChange={(event) =>
                        setFile(
                          event.target
                            .files?.[0] ||
                            null
                        )
                      }
                    />

                  </label>

                </div>
              )}

              {/* EXTERNAL URL */}

              <div className="dj-field">

                <label>
                  External URL
                  <span>
                    {type ===
                    "LIVE_CLASS"
                      ? "Required"
                      : "Optional"}
                  </span>
                </label>

                <input
                  type="url"
                  placeholder={
                    type ===
                    "LIVE_CLASS"
                      ? "https://meet.google.com/..."
                      : type ===
                        "RECORDED_CLASS"
                      ? "Optional YouTube / Vimeo link"
                      : "https://..."
                  }
                  value={externalUrl}
                  onChange={(event) =>
                    setExternalUrl(
                      event.target.value
                    )
                  }
                />

                {type ===
                  "LIVE_CLASS" && (
                  <small className="dj-field-help">
                    Paste your Google Meet
                    meeting link here.
                  </small>
                )}

                {type ===
                  "RECORDED_CLASS" && (
                  <small className="dj-field-help">
                    You can either upload a
                    video file or use a YouTube /
                    Vimeo URL.
                  </small>
                )}

              </div>

              {/* STATUS */}

              <div className="dj-field">

                <label>
                  Publishing status
                </label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value
                    )
                  }
                >

                  <option value="published">
                    Published
                  </option>

                  <option value="draft">
                    Draft
                  </option>

                </select>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={
                  uploading ||
                  !selectedCourse
                }
                className="dj-material-submit"
              >

                {uploading
                  ? "Uploading..."
                  : "Publish Material"}

                {!uploading && (
                  <span>→</span>
                )}

              </button>

            </form>

          </section>

          {/* =================================================
              EXISTING CONTENT
          ================================================= */}

          <section className="dj-material-card">

            <div className="dj-material-card-header">

              <div>

                <span>
                  PUBLISHED CONTENT
                </span>

                <h2>
                  Course library
                </h2>

              </div>

              <div className="dj-material-count">
                {materials?.length || 0}
              </div>

            </div>

            {!selectedCourse ? (
              <div className="dj-material-empty">
                Select a course to see its
                materials.
              </div>
            ) : materials === undefined ? (
              <div className="dj-material-empty">
                Loading course materials...
              </div>
            ) : materials.length === 0 ? (
              <div className="dj-material-empty">

                <div className="dj-empty-icon">
                  +
                </div>

                <h3>
                  No materials yet
                </h3>

                <p>
                  Upload the first class,
                  PDF or resource for this
                  course.
                </p>

              </div>
            ) : (
              <div className="dj-material-list">

                {materials.map(
                  (material: Material) => (
                    <MaterialRow
                      key={material._id}
                      material={material}
                      onDelete={
                        handleDelete
                      }
                      onToggleStatus={
                        handleToggleStatus
                      }
                    />
                  )
                )}

              </div>
            )}

          </section>

        </div>

      </main>

      <AdminMaterialStyles />
    </>
  );
}

/* =========================================================
   MATERIAL ROW
========================================================= */

function MaterialRow({
  material,
  onDelete,
  onToggleStatus,
}: {
  material: Material;
  onDelete: (
    id: string,
    title: string
  ) => void;
  onToggleStatus: (
    material: Material
  ) => void;
}) {
  const type = String(
    material.type || ""
  ).toUpperCase();

  let icon = "DOC";
  let label = "RESOURCE";

  if (
    type === "RECORDED_CLASS" ||
    type === "VIDEO" ||
    type === "RECORDING"
  ) {
    icon = "▶";
    label = "RECORDED";
  } else if (
    type === "LIVE_CLASS" ||
    type === "LIVE" ||
    type === "GOOGLE_MEET"
  ) {
    icon = "LIVE";
    label = "LIVE CLASS";
  } else if (
    type === "PDF"
  ) {
    icon = "PDF";
    label = "PDF";
  } else if (
    type === "NOTE" ||
    type === "NOTES"
  ) {
    icon = "NOTE";
    label = "NOTES";
  }

  const href =
    material.storageUrl ||
    material.url ||
    "";

  return (
    <article className="dj-material-row">

      <div className="dj-material-row-icon">
        {icon}
      </div>

      <div className="dj-material-row-main">

        <div className="dj-material-row-label">
          {label}
        </div>

        <h3>
          {material.title}
        </h3>

        {material.description && (
          <p>
            {material.description}
          </p>
        )}

        <div className="dj-material-row-meta">

          <span
            className={
              material.status ===
              "published"
                ? "published"
                : "draft"
            }
          >
            {material.status ===
            "published"
              ? "Published"
              : "Draft"}
          </span>

          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open
            </a>
          )}

        </div>

      </div>

      <div className="dj-material-row-actions">

        <button
          type="button"
          onClick={() =>
            onToggleStatus(material)
          }
        >
          {material.status ===
          "published"
            ? "Draft"
            : "Publish"}
        </button>

        <button
          type="button"
          className="danger"
          onClick={() =>
            onDelete(
              material._id,
              material.title
            )
          }
        >
          Delete
        </button>

      </div>

    </article>
  );
}

/* =========================================================
   STYLES
========================================================= */

function AdminMaterialStyles() {
  return (
    <style jsx global>{`

      .dj-admin-loading {
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #f8f5ee;
        color: #17263b;
        font-size: 14px;
      }

      .dj-material-page {
        min-height: 100vh;
        padding:
          110px
          42px
          90px;
        background: #f8f5ee;
        color: #142238;
      }

      .dj-material-header {
        width: min(
          1250px,
          100%
        );
        margin: 0 auto 30px;

        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 30px;
      }

      .dj-material-eyebrow {
        color: #b27b2e;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: .2em;
        margin-bottom: 10px;
      }

      .dj-material-header h1 {
        margin: 0;
        font-family:
          Georgia,
          "Times New Roman",
          serif;
        font-size: clamp(
          42px,
          5vw,
          65px
        );
        font-weight: 500;
        letter-spacing: -.04em;
        line-height: 1;
      }

      .dj-material-header p {
        max-width: 620px;
        margin: 14px 0 0;
        color: #718096;
        font-size: 14px;
        line-height: 1.7;
      }

      .dj-material-header-badge {
        padding: 11px 14px;
        border:
          1px solid #ddd4c6;
        background: white;
        color: #8e6b3e;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: .14em;
        white-space: nowrap;
      }

      /* =====================================================
         COURSE SELECTOR
      ===================================================== */

      .dj-material-course-selector {
        width: min(
          1250px,
          100%
        );
        margin: 0 auto 18px;

        padding: 18px 20px;

        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 25px;

        background: white;
        border:
          1px solid #e3dbcf;
      }

      .dj-material-selector-copy span {
        display: block;
        color: #b27b2e;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: .16em;
        margin-bottom: 5px;
      }

      .dj-material-selector-copy strong {
        font-size: 13px;
        font-weight: 700;
      }

      .dj-material-course-selector select {
        min-width: 350px;
        padding: 13px 15px;
        border:
          1px solid #d9d0c3;
        background: #faf8f3;
        color: #17263b;
        font-size: 13px;
        font-weight: 700;
        outline: none;
      }

      /* =====================================================
         MESSAGES
      ===================================================== */

      .dj-material-success,
      .dj-material-error {
        width: min(
          1250px,
          100%
        );
        margin: 0 auto 16px;

        padding: 13px 16px;

        display: flex;
        align-items: center;
        gap: 10px;

        font-size: 12px;
        font-weight: 700;
      }

      .dj-material-success {
        background: #edf8f1;
        border: 1px solid #cde5d6;
        color: #24714b;
      }

      .dj-material-error {
        background: #fff0ef;
        border: 1px solid #f0c8c5;
        color: #b43b35;
      }

      .dj-material-success span,
      .dj-material-error span {
        width: 22px;
        height: 22px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: white;
      }

      /* =====================================================
         GRID
      ===================================================== */

      .dj-material-grid {
        width: min(
          1250px,
          100%
        );
        margin: 0 auto;

        display: grid;

        grid-template-columns:
          420px
          minmax(0, 1fr);

        gap: 20px;

        align-items: start;
      }

      .dj-material-card {
        background: white;
        border:
          1px solid #e2dbd0;
      }

      .dj-material-card-header {
        padding: 22px;
        border-bottom:
          1px solid #ebe4da;

        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 15px;
      }

      .dj-material-card-header > div:first-child span {
        display: block;
        color: #b27b2e;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: .16em;
        margin-bottom: 7px;
      }

      .dj-material-card-header h2 {
        margin: 0;
        font-family:
          Georgia,
          serif;
        font-size: 25px;
        font-weight: 500;
        line-height: 1.1;
      }

      .dj-material-current-course {
        max-width: 180px;
        padding: 8px 10px;
        background: #f7f0e4;
        color: #8e672e;
        font-size: 9px;
        font-weight: 800;
        line-height: 1.4;
      }

      .dj-material-count {
        width: 34px;
        height: 34px;

        display: grid;
        place-items: center;

        border:
          1px solid #e0d8cc;
        border-radius: 50%;

        color: #8e6b3e;
        font-size: 10px;
        font-weight: 900;
      }

      /* =====================================================
         FORM
      ===================================================== */

      .dj-material-form {
        padding: 22px;
      }

      .dj-field {
        margin-bottom: 17px;
      }

      .dj-field label {
        display: flex;
        justify-content: space-between;
        gap: 10px;

        margin-bottom: 7px;

        color: #26374c;
        font-size: 10px;
        font-weight: 800;
      }

      .dj-field label span {
        color: #9ba5b1;
        font-weight: 600;
      }

      .dj-field input,
      .dj-field textarea,
      .dj-field select {
        width: 100%;
        box-sizing: border-box;

        padding: 12px 13px;

        border:
          1px solid #ddd5c9;

        background: #fcfbf8;

        color: #17263b;

        font-family: inherit;
        font-size: 12px;

        outline: none;

        transition:
          border-color .2s ease,
          box-shadow .2s ease;
      }

      .dj-field textarea {
        resize: vertical;
        min-height: 95px;
      }

      .dj-field input:focus,
      .dj-field textarea:focus,
      .dj-field select:focus {
        border-color: #b68a4a;

        box-shadow:
          0 0 0 3px
          rgba(182,138,74,.1);
      }

      .dj-field-help {
        display: block;
        margin-top: 6px;
        color: #8b96a4;
        font-size: 9px;
        line-height: 1.5;
      }

      /* =====================================================
         FILE DROP
      ===================================================== */

      .dj-file-drop {
        min-height: 145px;

        display: flex !important;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        padding: 18px;

        border:
          1px dashed #cfc5b6 !important;

        background:
          #faf8f3 !important;

        text-align: center;

        cursor: pointer;

        transition:
          border-color .2s ease,
          background .2s ease;
      }

      .dj-file-drop:hover {
        border-color:
          #b8894b !important;

        background:
          #f8f2e8 !important;
      }

      .dj-file-drop input {
        display: none;
      }

      .dj-file-icon {
        width: 38px;
        height: 38px;

        display: grid;
        place-items: center;

        margin-bottom: 9px;

        border-radius: 10px;

        background: #f3e7d1;

        color: #a96f1d;

        font-size: 20px;
        font-weight: 400;
      }

      .dj-file-drop strong {
        color: #26374c;
        font-size: 12px;
      }

      .dj-file-drop > span {
        max-width: 300px;
        margin-top: 5px;
        color: #8994a3;
        font-size: 9px;
        line-height: 1.5;
      }

      /* =====================================================
         SUBMIT
      ===================================================== */

      .dj-material-submit {
        width: 100%;

        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;

        margin-top: 5px;

        padding: 14px 18px;

        border: 0;

        background: #102039;

        color: white;

        font-size: 11px;
        font-weight: 800;

        cursor: pointer;

        transition:
          background .2s ease,
          transform .2s ease;
      }

      .dj-material-submit:hover {
        background: #1a3150;
        transform: translateY(-1px);
      }

      .dj-material-submit:disabled {
        opacity: .55;
        cursor: not-allowed;
        transform: none;
      }

      /* =====================================================
         LIST
      ===================================================== */

      .dj-material-list {
        display: flex;
        flex-direction: column;
      }

      .dj-material-row {
        padding: 17px 20px;

        display: flex;
        align-items: flex-start;
        gap: 13px;

        border-bottom:
          1px solid #eee8df;
      }

      .dj-material-row:last-child {
        border-bottom: 0;
      }

      .dj-material-row-icon {
        width: 45px;
        height: 45px;

        flex: 0 0 45px;

        display: grid;
        place-items: center;

        background: #f7efe1;

        color: #a87331;

        font-size: 8px;
        font-weight: 900;
      }

      .dj-material-row-main {
        min-width: 0;
        flex: 1;
      }

      .dj-material-row-label {
        color: #b27b2e;
        font-size: 7px;
        font-weight: 900;
        letter-spacing: .14em;
      }

      .dj-material-row h3 {
        margin: 4px 0 0;

        color: #18283e;

        font-size: 13px;
        font-weight: 800;
      }

      .dj-material-row p {
        margin: 4px 0 0;

        color: #8490a0;

        font-size: 10px;
        line-height: 1.5;
      }

      .dj-material-row-meta {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;

        margin-top: 8px;
      }

      .dj-material-row-meta span {
        padding: 4px 7px;

        font-size: 7px;
        font-weight: 900;
        letter-spacing: .05em;
        text-transform: uppercase;
      }

      .dj-material-row-meta span.published {
        background: #edf8f1;
        color: #24714b;
      }

      .dj-material-row-meta span.draft {
        background: #f5eee3;
        color: #96703c;
      }

      .dj-material-row-meta a {
        color: #52647a;
        font-size: 9px;
        font-weight: 800;
      }

      .dj-material-row-actions {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .dj-material-row-actions button {
        min-width: 65px;

        padding: 7px 8px;

        border:
          1px solid #ded6ca;

        background: white;

        color: #536276;

        font-size: 8px;
        font-weight: 800;

        cursor: pointer;
      }

      .dj-material-row-actions button:hover {
        background: #f7f3ed;
      }

      .dj-material-row-actions button.danger {
        border-color: #efd1ce;
        color: #b54740;
      }

      .dj-material-row-actions button.danger:hover {
        background: #fff2f1;
      }

      /* =====================================================
         EMPTY
      ===================================================== */

      .dj-material-empty {
        min-height: 300px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        padding: 35px;

        text-align: center;

        color: #7f8b99;

        font-size: 11px;
      }

      .dj-empty-icon {
        width: 42px;
        height: 42px;

        display: grid;
        place-items: center;

        margin-bottom: 12px;

        border-radius: 12px;

        background: #f6ecd9;

        color: #b87820;

        font-size: 23px;
      }

      .dj-material-empty h3 {
        margin: 0;

        color: #1c2c42;

        font-family:
          Georgia,
          serif;

        font-size: 22px;
        font-weight: 500;
      }

      .dj-material-empty p {
        max-width: 330px;

        margin: 7px 0 0;

        color: #8a95a3;

        font-size: 10px;
        line-height: 1.6;
      }

      /* =====================================================
         RESPONSIVE
      ===================================================== */

      @media (max-width: 1050px) {

        .dj-material-grid {
          grid-template-columns: 1fr;
        }

      }

      @media (max-width: 700px) {

        .dj-material-page {
          padding:
            90px
            16px
            60px;
        }

        .dj-material-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .dj-material-header-badge {
          display: none;
        }

        .dj-material-course-selector {
          flex-direction: column;
          align-items: stretch;
        }

        .dj-material-course-selector select {
          min-width: 0;
          width: 100%;
        }

        .dj-material-row {
          flex-wrap: wrap;
        }

        .dj-material-row-main {
          width:
            calc(100% - 58px);
        }

        .dj-material-row-actions {
          width: 100%;
          flex-direction: row;
          padding-left: 58px;
        }

        .dj-material-row-actions button {
          flex: 1;
        }

      }

    `}</style>
  );
}