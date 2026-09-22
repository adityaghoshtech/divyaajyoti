"use client";

import {
  ChangeEvent,
  FormEvent,
  useMemo,
  useState,
} from "react";

import {
  useMutation,
  useQuery,
} from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

/* =========================================================
   TYPES
========================================================= */

type MaterialType =
  | "RECORDED_CLASS"
  | "PDF"
  | "NOTE"
  | "LIVE_CLASS"
  | "GOOGLE_MEET"
  | "VIDEO_LINK"
  | "RESOURCE";

type Course = {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  duration?: string;
  level?: string;
  status?: string;
};

type Material = {
  _id: Id<"courseMaterials">;
  courseSlug: string;
  title: string;
  type: string;
  description?: string;
  url?: string;
  storageId?: Id<"_storage"> | string;
  sortOrder: number;
  status: string;
  createdAt: number;
  updatedAt?: number;
};

/* =========================================================
   MATERIAL TYPES
========================================================= */

const MATERIAL_OPTIONS: {
  value: MaterialType;
  label: string;
  description: string;
  acceptsFile: boolean;
  acceptsUrl: boolean;
}[] = [
  {
    value: "RECORDED_CLASS",
    label: "Recorded Class",
    description:
      "Upload a recorded lesson video such as MP4, WebM or MOV.",
    acceptsFile: true,
    acceptsUrl: true,
  },
  {
    value: "PDF",
    label: "PDF / Document",
    description:
      "Upload a PDF, workbook, presentation or course document.",
    acceptsFile: true,
    acceptsUrl: true,
  },
  {
    value: "NOTE",
    label: "Study Note",
    description:
      "Upload study notes or provide an external study document.",
    acceptsFile: true,
    acceptsUrl: true,
  },
  {
    value: "LIVE_CLASS",
    label: "Live Class",
    description:
      "Add a Google Meet or other live class joining link.",
    acceptsFile: false,
    acceptsUrl: true,
  },
  {
    value: "GOOGLE_MEET",
    label: "Google Meet",
    description:
      "Add the Google Meet link students will use to join.",
    acceptsFile: false,
    acceptsUrl: true,
  },
  {
    value: "VIDEO_LINK",
    label: "External Video",
    description:
      "Use YouTube, Vimeo, Google Drive or another video URL.",
    acceptsFile: false,
    acceptsUrl: true,
  },
  {
    value: "RESOURCE",
    label: "Other Resource",
    description:
      "Add another useful file, document or external resource.",
    acceptsFile: true,
    acceptsUrl: true,
  },
];

/* =========================================================
   HELPERS
========================================================= */

function normalizeType(value?: string) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
}

function prettyType(value?: string) {
  const normalized = normalizeType(value);

  const found = MATERIAL_OPTIONS.find(
    (item) => item.value === normalized,
  );

  return found?.label || value || "Material";
}

function getMaterialOption(type: MaterialType) {
  return MATERIAL_OPTIONS.find(
    (item) => item.value === type,
  );
}

function getFileAccept(type: MaterialType) {
  switch (type) {
    case "RECORDED_CLASS":
      return "video/mp4,video/webm,video/quicktime";

    case "PDF":
      return "application/pdf";

    case "NOTE":
      return ".pdf,.doc,.docx,.ppt,.pptx,.txt";

    case "RESOURCE":
      return "*/*";

    default:
      return "";
  }
}

function getCourseName(
  courses: Course[] | undefined,
  slug: string,
) {
  const course = courses?.find(
    (item) => item.slug === slug,
  );

  return course?.title || slug;
}

/* =========================================================
   PAGE
========================================================= */

export default function CourseMaterialsAdminPage() {
  /* =======================================================
     COURSES
  ======================================================= */

  const courses = useQuery(
    api.courses.list,
    {},
  );

  /* =======================================================
     MATERIALS
  ======================================================= */

  const materials = useQuery(
    api.courseMaterials.list,
    {
      includeDrafts: true,
      courseSlug: "",
    },
  );

  /* =======================================================
     MUTATIONS
  ======================================================= */

  const generateUploadUrl = useMutation(
    api.courseMaterials.generateUploadUrl,
  );

  const createMaterial = useMutation(
    api.courseMaterials.create,
  );

  const updateMaterial = useMutation(
    api.courseMaterials.update,
  );

  const removeMaterial = useMutation(
    api.courseMaterials.remove,
  );

  /* =======================================================
     MODAL
  ======================================================= */

  const [showModal, setShowModal] =
    useState(false);

  const [editingMaterial, setEditingMaterial] =
    useState<Material | null>(null);

  /* =======================================================
     FORM
  ======================================================= */

  const [courseSlug, setCourseSlug] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [type, setType] =
    useState<MaterialType>(
      "RECORDED_CLASS",
    );

  const [description, setDescription] =
    useState("");

  const [externalUrl, setExternalUrl] =
    useState("");

  const [sortOrder, setSortOrder] =
    useState("0");

  const [status, setStatus] =
    useState<"DRAFT" | "PUBLISHED">(
      "DRAFT",
    );

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  /* =======================================================
     FILTERS
  ======================================================= */

  const [filterCourse, setFilterCourse] =
    useState("ALL");

  const [filterType, setFilterType] =
    useState("ALL");

  const [search, setSearch] =
    useState("");

  /* =======================================================
     UI
  ======================================================= */

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<Id<"courseMaterials"> | null>(
      null,
    );

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* =======================================================
     SELECTED TYPE
  ======================================================= */

  const selectedType =
    getMaterialOption(type);

  /* =======================================================
     RESET FORM
  ======================================================= */

  const resetForm = () => {
    setCourseSlug("");
    setTitle("");
    setType("RECORDED_CLASS");
    setDescription("");
    setExternalUrl("");
    setSortOrder("0");
    setStatus("DRAFT");
    setSelectedFile(null);
    setEditingMaterial(null);
    setError("");
    setSuccess("");
  };

  /* =======================================================
     OPEN CREATE
  ======================================================= */

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  /* =======================================================
     OPEN EDIT
  ======================================================= */

  const openEdit = (
    material: Material,
  ) => {
    setEditingMaterial(material);

    setCourseSlug(
      material.courseSlug || "",
    );

    setTitle(
      material.title || "",
    );

    const normalizedType =
      normalizeType(
        material.type,
      ) as MaterialType;

    const supported =
      MATERIAL_OPTIONS.some(
        (item) =>
          item.value ===
          normalizedType,
      );

    setType(
      supported
        ? normalizedType
        : "RESOURCE",
    );

    setDescription(
      material.description || "",
    );

    setExternalUrl(
      material.url || "",
    );

    setSortOrder(
      String(
        material.sortOrder ?? 0,
      ),
    );

    setStatus(
      String(
        material.status ?? "DRAFT",
      ).toUpperCase() === "PUBLISHED"
        ? "PUBLISHED"
        : "DRAFT",
    );

    setSelectedFile(null);

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    resetForm();
  };

  /* =======================================================
     COURSE CHANGE
  ======================================================= */

  const handleCourseChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    setCourseSlug(
      event.target.value,
    );

    setError("");
  };

  /* =======================================================
     TYPE CHANGE
  ======================================================= */

  const handleTypeChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const nextType =
      event.target.value as MaterialType;

    setType(nextType);

    /*
     * Clear the old file when the
     * material category changes.
     */
    setSelectedFile(null);

    /*
     * A live class / Google Meet
     * does not need a file.
     */
    if (
      nextType === "LIVE_CLASS" ||
      nextType === "GOOGLE_MEET"
    ) {
      setExternalUrl("");
    }

    setError("");
  };

  /* =======================================================
     FILE CHANGE
  ======================================================= */

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setError("");

    const file =
      event.target.files?.[0] ?? null;

    setSelectedFile(file);
  };

  /* =======================================================
     UPLOAD FILE TO CONVEX
  ======================================================= */

  const uploadFile = async (
    file: File,
  ): Promise<Id<"_storage">> => {
    const uploadUrl =
      await generateUploadUrl({});

    if (!uploadUrl) {
      throw new Error(
        "Could not create the Convex upload URL.",
      );
    }

    const response =
      await fetch(
        uploadUrl,
        {
          method: "POST",
          headers: {
            "Content-Type":
              file.type ||
              "application/octet-stream",
          },
          body: file,
        },
      );

    if (!response.ok) {
      throw new Error(
        `Upload failed for ${file.name}.`,
      );
    }

    const result =
      await response.json();

    if (!result.storageId) {
      throw new Error(
        "Convex did not return a storage ID.",
      );
    }

    return result.storageId as Id<"_storage">;
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateForm = () => {
    if (!courseSlug) {
      return "Please select a course.";
    }

    if (!title.trim()) {
      return "Please enter a material title.";
    }

    /*
     * Live classes and Google Meet
     * require a URL.
     */
    if (
      type === "LIVE_CLASS" ||
      type === "GOOGLE_MEET"
    ) {
      if (!externalUrl.trim()) {
        return "Please enter the Google Meet / live class link.";
      }
    }

    /*
     * Recorded class can use either
     * an uploaded video or external URL.
     */
    if (
      type === "RECORDED_CLASS"
    ) {
      if (
        !selectedFile &&
        !externalUrl.trim() &&
        !editingMaterial?.storageId
      ) {
        return "Please upload a recorded class video or enter a video URL.";
      }
    }

    /*
     * PDF
     */
    if (type === "PDF") {
      if (
        !selectedFile &&
        !externalUrl.trim() &&
        !editingMaterial?.storageId
      ) {
        return "Please upload a PDF or enter a document URL.";
      }
    }

    /*
     * Note
     */
    if (type === "NOTE") {
      if (
        !selectedFile &&
        !externalUrl.trim() &&
        !editingMaterial?.storageId
      ) {
        return "Please upload a note or enter a document URL.";
      }
    }

    /*
     * External video
     */
    if (
      type === "VIDEO_LINK"
    ) {
      if (!externalUrl.trim()) {
        return "Please enter the external video URL.";
      }
    }

    /*
     * Other resource
     */
    if (type === "RESOURCE") {
      if (
        !selectedFile &&
        !externalUrl.trim() &&
        !editingMaterial?.storageId
      ) {
        return "Please upload a file or enter a resource URL.";
      }
    }

    return "";
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validation =
      validateForm();

    if (validation) {
      setError(validation);
      return;
    }

    setSaving(true);

    try {
      let storageId:
        | Id<"_storage">
        | undefined;

      /*
       * Upload a new file if selected.
       */
      if (selectedFile) {
        storageId =
          await uploadFile(
            selectedFile,
          );
      }

      const cleanUrl =
        externalUrl.trim();

      const cleanTitle =
        title.trim();

      const cleanDescription =
        description.trim();

      const cleanCourseSlug =
        courseSlug.trim();

      const cleanSortOrder =
        Number(sortOrder || 0);

      /*
       * CREATE
       */
      if (!editingMaterial) {
        await createMaterial({
          courseSlug:
            cleanCourseSlug,

          title:
            cleanTitle,

          type,

          description:
            cleanDescription ||
            undefined,

          url:
            cleanUrl ||
            undefined,

          storageId,

          sortOrder:
            cleanSortOrder,

          status,
        });
      }

      /*
       * UPDATE
       */
      else {
        await updateMaterial({
          id:
            editingMaterial._id,

          courseSlug:
            cleanCourseSlug,

          title:
            cleanTitle,

          type,

          description:
            cleanDescription ||
            undefined,

          url:
            cleanUrl ||
            undefined,

          ...(storageId
            ? {
                storageId,
              }
            : {}),

          sortOrder:
            cleanSortOrder,

          status,
        });
      }

      setSuccess(
        editingMaterial
          ? "Course material updated successfully."
          : "Course material added successfully.",
      );

      /*
       * Close after successful save.
       */
      setTimeout(() => {
        setShowModal(false);
        resetForm();
      }, 700);
    } catch (err: any) {
      console.error(
        "Course material error:",
        err,
      );

      setError(
        err?.message ||
          "Unable to save course material.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async (
    id: Id<"courseMaterials">,
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this course material?",
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);

    try {
      await removeMaterial({
        id,
      });
    } catch (err: any) {
      window.alert(
        err?.message ||
          "Unable to delete material.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =======================================================
     FILTERED MATERIALS
  ======================================================= */

  const materialRows =
    useMemo(() => {
      if (!materials) {
        return [];
      }

      const query =
        search
          .trim()
          .toLowerCase();

      return [...materials]
        .filter((material) => {
          if (
            filterCourse !== "ALL" &&
            material.courseSlug !==
              filterCourse
          ) {
            return false;
          }

          if (
            filterType !== "ALL" &&
            normalizeType(
              material.type,
            ) !== filterType
          ) {
            return false;
          }

          if (!query) {
            return true;
          }

          return (
            material.title
              .toLowerCase()
              .includes(query) ||
            material.courseSlug
              .toLowerCase()
              .includes(query) ||
            String(
              material.description ||
                "",
            )
              .toLowerCase()
              .includes(query)
          );
        })
        .sort(
          (a, b) =>
            a.courseSlug.localeCompare(
              b.courseSlug,
            ) ||
            a.sortOrder -
              b.sortOrder,
        );
    }, [
      materials,
      filterCourse,
      filterType,
      search,
    ]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (
    courses === undefined ||
    materials === undefined
  ) {
    return (
      <>
        <main className="cm-page">
          <div className="cm-loading-page">
            <div className="cm-loader" />
            <h2>
              Loading course materials...
            </h2>
            <p>
              Loading courses and learning content.
            </p>
          </div>
        </main>

        <CourseMaterialsStyles />
      </>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <>
      <main className="cm-page">
        <div className="cm-container">

          {/* =================================================
              HEADER
          ================================================= */}

          <header className="cm-header">

            <div>
              <div className="cm-eyebrow">
                DIVYAJYOTI ADMIN
              </div>

              <h1>
                Course Materials
              </h1>

              <p>
                Upload and manage recorded
                classes, PDFs, notes and live
                classes for each course.
              </p>
            </div>

            <button
              type="button"
              className="cm-primary-button"
              onClick={openCreate}
            >
              <span className="cm-plus">
                +
              </span>

              Add Course Material
            </button>

          </header>

          {/* =================================================
              HOW IT WORKS
          ================================================= */}

          <section className="cm-info-grid">

            <div className="cm-info-card">
              <span className="cm-info-number">
                01
              </span>

              <div>
                <strong>
                  Select Course
                </strong>

                <p>
                  Choose one of the courses
                  already created in your
                  Courses section.
                </p>
              </div>
            </div>

            <div className="cm-info-card">
              <span className="cm-info-number">
                02
              </span>

              <div>
                <strong>
                  Add Content
                </strong>

                <p>
                  Upload videos, PDFs and
                  notes or add a Google Meet
                  link.
                </p>
              </div>
            </div>

            <div className="cm-info-card">
              <span className="cm-info-number">
                03
              </span>

              <div>
                <strong>
                  Publish
                </strong>

                <p>
                  Published content appears
                  inside the student's private
                  course page.
                </p>
              </div>
            </div>

          </section>

          {/* =================================================
              FILTERS
          ================================================= */}

          <section className="cm-filter-panel">

            <div className="cm-filter">

              <label>
                COURSE
              </label>

              <select
                value={filterCourse}
                onChange={(event) =>
                  setFilterCourse(
                    event.target.value,
                  )
                }
              >
                <option value="ALL">
                  All courses
                </option>

                {courses.map(
                  (course) => (
                    <option
                      key={course._id}
                      value={course.slug}
                    >
                      {course.title}
                    </option>
                  ),
                )}
              </select>

            </div>

            <div className="cm-filter">

              <label>
                MATERIAL
              </label>

              <select
                value={filterType}
                onChange={(event) =>
                  setFilterType(
                    event.target.value,
                  )
                }
              >
                <option value="ALL">
                  All materials
                </option>

                {MATERIAL_OPTIONS.map(
                  (option) => (
                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>

            </div>

            <div className="cm-filter">

              <label>
                SEARCH
              </label>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search materials..."
              />

            </div>

            <div className="cm-total">

              <span>
                TOTAL
              </span>

              <strong>
                {materialRows.length}
              </strong>

            </div>

          </section>

          {/* =================================================
              COURSE SUMMARY
          ================================================= */}

          <section className="cm-course-summary">

            <div>
              <span>
                COURSE LIBRARY
              </span>

              <h2>
                Learning content
              </h2>

              <p>
                Every material below is
                attached to a specific course.
              </p>
            </div>

            <div className="cm-course-count">
              {courses.length}
              <small>
                Courses
              </small>
            </div>

          </section>

          {/* =================================================
              MATERIAL LIST
          ================================================= */}

          <section className="cm-library">

            {materialRows.length === 0 ? (
              <div className="cm-empty">

                <div className="cm-empty-icon">
                  +
                </div>

                <h3>
                  No course materials yet
                </h3>

                <p>
                  Add your first video, PDF,
                  note or live class.
                </p>

                <button
                  type="button"
                  className="cm-primary-button"
                  onClick={
                    openCreate
                  }
                >
                  + Add Course Material
                </button>

              </div>
            ) : (
              <div className="cm-material-list">

                {materialRows.map(
                  (material) => (
                    <article
                      key={
                        material._id
                      }
                      className="cm-material-row"
                    >

                      <div className="cm-material-icon">
                        {normalizeType(
                          material.type,
                        ) ===
                        "RECORDED_CLASS"
                          ? "▶"
                          : normalizeType(
                              material.type,
                            ) === "PDF"
                            ? "PDF"
                            : normalizeType(
                                material.type,
                              ) ===
                              "GOOGLE_MEET"
                              ? "G"
                              : normalizeType(
                                  material.type,
                                ) ===
                                "LIVE_CLASS"
                                ? "LIVE"
                                : "DOC"}
                      </div>

                      <div className="cm-material-main">

                        <div className="cm-material-top">

                          <span className="cm-type-badge">
                            {prettyType(
                              material.type,
                            )}
                          </span>

                          <span
                            className={
                              String(
                                material.status,
                              ).toUpperCase() ===
                              "PUBLISHED"
                                ? "cm-status published"
                                : "cm-status draft"
                            }
                          >
                            {String(
                              material.status,
                            ).toUpperCase()}
                          </span>

                        </div>

                        <h3>
                          {material.title}
                        </h3>

                        <div className="cm-course-name">
                          Course:
                          <strong>
                            {getCourseName(
                              courses,
                              material.courseSlug,
                            )}
                          </strong>
                        </div>

                        <div className="cm-slug">
                          {material.courseSlug}
                        </div>

                        {material.description && (
                          <p>
                            {
                              material.description
                            }
                          </p>
                        )}

                        <div className="cm-source">

                          {material.storageId ? (
                            <span>
                              File uploaded
                            </span>
                          ) : material.url ? (
                            <span>
                              External link
                            </span>
                          ) : (
                            <span>
                              No file or link
                            </span>
                          )}

                        </div>

                      </div>

                      <div className="cm-material-order">
                        <span>
                          ORDER
                        </span>

                        <strong>
                          {
                            material.sortOrder
                          }
                        </strong>
                      </div>

                      <div className="cm-actions">

                        <button
                          type="button"
                          onClick={() =>
                            openEdit(
                              material,
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="danger"
                          disabled={
                            deletingId ===
                            material._id
                          }
                          onClick={() =>
                            handleDelete(
                              material._id,
                            )
                          }
                        >
                          {deletingId ===
                          material._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>

                    </article>
                  ),
                )}

              </div>
            )}

          </section>

        </div>
      </main>

      {/* =====================================================
          MODAL
      ===================================================== */}

      {showModal && (
        <div
          className="cm-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >

          <div className="cm-modal">

            {/* ===============================================
                MODAL HEADER
            =============================================== */}

            <div className="cm-modal-header">

              <div>
                <div className="cm-eyebrow">
                  COURSE CONTENT
                </div>

                <h2>
                  {editingMaterial
                    ? "Edit Course Material"
                    : "Add Course Material"}
                </h2>

                <p>
                  Select a course, choose the
                  content type and upload the
                  material for that course.
                </p>
              </div>

              <button
                type="button"
                className="cm-close"
                onClick={closeModal}
                disabled={saving}
              >
                ×
              </button>

            </div>

            {/* ===============================================
                FORM
            =============================================== */}

            <form
              className="cm-form"
              onSubmit={
                handleSubmit
              }
            >

              {/* ===========================================
                  COURSE
              =========================================== */}

              <div className="cm-field">

                <label>
                  Select Course
                  <span>
                    *
                  </span>
                </label>

                <select
                  value={courseSlug}
                  onChange={
                    handleCourseChange
                  }
                  required
                >

                  <option value="">
                    Select a course
                  </option>

                  {courses.map(
                    (course) => (
                      <option
                        key={
                          course._id
                        }
                        value={
                          course.slug
                        }
                      >
                        {course.title}
                        {" "}
                        •
                        {" "}
                        {course.category ||
                          "Course"}
                      </option>
                    ),
                  )}

                </select>

                {courseSlug && (
                  <small className="cm-help">
                    Course slug:
                    {" "}
                    <strong>
                      {courseSlug}
                    </strong>
                  </small>
                )}

              </div>

              {/* ===========================================
                  TITLE
              =========================================== */}

              <div className="cm-field">

                <label>
                  Material Title
                  <span>
                    *
                  </span>
                </label>

                <input
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value,
                    )
                  }
                  placeholder={
                    type ===
                    "RECORDED_CLASS"
                      ? "Predictive Astrology Class 01"
                      : type === "PDF"
                        ? "Predictive Astrology Notes - Chapter 01"
                        : type ===
                            "LIVE_CLASS"
                          ? "Live Class - Week 01"
                          : "Course Resource"
                  }
                  required
                />

              </div>

              {/* ===========================================
                  MATERIAL TYPE
              =========================================== */}

              <div className="cm-field">

                <label>
                  Content Type
                  <span>
                    *
                  </span>
                </label>

                <select
                  value={type}
                  onChange={
                    handleTypeChange
                  }
                  required
                >

                  {MATERIAL_OPTIONS.map(
                    (option) => (
                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {option.label}
                      </option>
                    ),
                  )}

                </select>

                {selectedType && (
                  <small className="cm-help">
                    {
                      selectedType.description
                    }
                  </small>
                )}

              </div>

              {/* ===========================================
                  CONDITIONAL CONTENT AREA
              =========================================== */}

              {type ===
                "RECORDED_CLASS" && (
                <div className="cm-special-box video-box">

                  <div className="cm-special-heading">
                    <div className="cm-special-icon">
                      ▶
                    </div>

                    <div>
                      <strong>
                        Recorded Class Video
                      </strong>

                      <p>
                        Upload your recorded
                        class video.
                      </p>
                    </div>
                  </div>

                  <label className="cm-upload-label">
                    Upload Video
                  </label>

                  <input
                    type="file"
                    accept={getFileAccept(
                      type,
                    )}
                    onChange={
                      handleFileChange
                    }
                    className="cm-file"
                  />

                  {selectedFile && (
                    <div className="cm-selected-file">
                      Selected:
                      {" "}
                      <strong>
                        {
                          selectedFile.name
                        }
                      </strong>
                    </div>
                  )}

                  <div className="cm-or">
                    OR
                  </div>

                  <input
                    value={
                      externalUrl
                    }
                    onChange={(event) =>
                      setExternalUrl(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Optional YouTube / Drive / video URL"
                  />

                </div>
              )}

              {type === "PDF" && (
                <div className="cm-special-box pdf-box">

                  <div className="cm-special-heading">
                    <div className="cm-special-icon">
                      PDF
                    </div>

                    <div>
                      <strong>
                        Course PDF
                      </strong>

                      <p>
                        Upload the PDF that
                        students should access.
                      </p>
                    </div>
                  </div>

                  <label className="cm-upload-label">
                    Upload PDF
                  </label>

                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={
                      handleFileChange
                    }
                    className="cm-file"
                  />

                  {selectedFile && (
                    <div className="cm-selected-file">
                      Selected:
                      {" "}
                      <strong>
                        {
                          selectedFile.name
                        }
                      </strong>
                    </div>
                  )}

                  <div className="cm-or">
                    OR
                  </div>

                  <input
                    value={
                      externalUrl
                    }
                    onChange={(event) =>
                      setExternalUrl(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Optional external PDF / Drive URL"
                  />

                </div>
              )}

              {type === "NOTE" && (
                <div className="cm-special-box note-box">

                  <div className="cm-special-heading">
                    <div className="cm-special-icon">
                      DOC
                    </div>

                    <div>
                      <strong>
                        Study Notes
                      </strong>

                      <p>
                        Upload notes,
                        worksheets or study
                        documents.
                      </p>
                    </div>
                  </div>

                  <label className="cm-upload-label">
                    Upload Notes
                  </label>

                  <input
                    type="file"
                    accept={getFileAccept(
                      type,
                    )}
                    onChange={
                      handleFileChange
                    }
                    className="cm-file"
                  />

                  {selectedFile && (
                    <div className="cm-selected-file">
                      Selected:
                      {" "}
                      <strong>
                        {
                          selectedFile.name
                        }
                      </strong>
                    </div>
                  )}

                  <div className="cm-or">
                    OR
                  </div>

                  <input
                    value={
                      externalUrl
                    }
                    onChange={(event) =>
                      setExternalUrl(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Optional Google Drive / document URL"
                  />

                </div>
              )}

              {(type ===
                "LIVE_CLASS" ||
                type ===
                  "GOOGLE_MEET") && (
                <div className="cm-special-box live-box">

                  <div className="cm-special-heading">

                    <div className="cm-special-icon live">
                      LIVE
                    </div>

                    <div>
                      <strong>
                        Live Class
                      </strong>

                      <p>
                        Students will use
                        this link to join the
                        live class.
                      </p>
                    </div>

                  </div>

                  <label className="cm-upload-label">
                    Google Meet Link
                    <span>
                      *
                    </span>
                  </label>

                  <input
                    type="url"
                    value={
                      externalUrl
                    }
                    onChange={(event) =>
                      setExternalUrl(
                        event.target
                          .value,
                      )
                    }
                    placeholder="https://meet.google.com/..."
                    required
                  />

                  <div className="cm-live-tip">
                    Example:
                    {" "}
                    https://meet.google.com/abc-defg-hij
                  </div>

                </div>
              )}

              {type ===
                "VIDEO_LINK" && (
                <div className="cm-special-box video-box">

                  <div className="cm-special-heading">

                    <div className="cm-special-icon">
                      ▶
                    </div>

                    <div>
                      <strong>
                        External Video
                      </strong>

                      <p>
                        Add a YouTube,
                        Vimeo or Google
                        Drive video URL.
                      </p>
                    </div>

                  </div>

                  <label className="cm-upload-label">
                    Video URL
                    <span>
                      *
                    </span>
                  </label>

                  <input
                    type="url"
                    value={
                      externalUrl
                    }
                    onChange={(event) =>
                      setExternalUrl(
                        event.target
                          .value,
                      )
                    }
                    placeholder="https://youtube.com/..."
                    required
                  />

                </div>
              )}

              {type === "RESOURCE" && (
                <div className="cm-special-box">

                  <div className="cm-special-heading">

                    <div className="cm-special-icon">
                      +
                    </div>

                    <div>
                      <strong>
                        Other Course Resource
                      </strong>

                      <p>
                        Upload a file or
                        provide an external
                        resource URL.
                      </p>
                    </div>

                  </div>

                  <label className="cm-upload-label">
                    Upload Resource
                  </label>

                  <input
                    type="file"
                    accept="*/*"
                    onChange={
                      handleFileChange
                    }
                    className="cm-file"
                  />

                  {selectedFile && (
                    <div className="cm-selected-file">
                      Selected:
                      {" "}
                      <strong>
                        {
                          selectedFile.name
                        }
                      </strong>
                    </div>
                  )}

                  <div className="cm-or">
                    OR
                  </div>

                  <input
                    value={
                      externalUrl
                    }
                    onChange={(event) =>
                      setExternalUrl(
                        event.target
                          .value,
                      )
                    }
                    placeholder="https://..."
                  />

                </div>
              )}

              {/* ===========================================
                  DESCRIPTION
              =========================================== */}

              <div className="cm-field">

                <label>
                  Description
                </label>

                <textarea
                  value={
                    description
                  }
                  onChange={(event) =>
                    setDescription(
                      event.target
                        .value,
                    )
                  }
                  rows={4}
                  placeholder="Explain what students will find in this material..."
                />

              </div>

              {/* ===========================================
                  ORDER + STATUS
              =========================================== */}

              <div className="cm-two-columns">

                <div className="cm-field">

                  <label>
                    Display Order
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={
                      sortOrder
                    }
                    onChange={(event) =>
                      setSortOrder(
                        event.target
                          .value,
                      )
                    }
                  />

                  <small className="cm-help">
                    0 appears first.
                  </small>

                </div>

                <div className="cm-field">

                  <label>
                    Publishing Status
                    <span>
                      *
                    </span>
                  </label>

                  <select
                    value={
                      status
                    }
                    onChange={(event) =>
                      setStatus(
                        event.target
                          .value as
                          | "DRAFT"
                          | "PUBLISHED",
                      )
                    }
                  >
                    <option value="DRAFT">
                      Draft
                    </option>

                    <option value="PUBLISHED">
                      Published
                    </option>
                  </select>

                  <small className="cm-help">
                    Only published
                    materials appear to
                    students.
                  </small>

                </div>

              </div>

              {/* ===========================================
                  ERROR
              =========================================== */}

              {error && (
                <div className="cm-alert error">
                  {error}
                </div>
              )}

              {/* ===========================================
                  SUCCESS
              =========================================== */}

              {success && (
                <div className="cm-alert success">
                  {success}
                </div>
              )}

              {/* ===========================================
                  ACTIONS
              =========================================== */}

              <div className="cm-form-actions">

                <button
                  type="button"
                  className="cm-secondary-button"
                  onClick={
                    closeModal
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="cm-primary-button"
                  disabled={
                    saving ||
                    courses.length ===
                      0
                  }
                >
                  {saving
                    ? "Saving..."
                    : editingMaterial
                      ? "Update Material"
                      : "Save Course Material"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      <CourseMaterialsStyles />
    </>
  );
}

/* =========================================================
   STYLES
========================================================= */

function CourseMaterialsStyles() {
  return (
    <style jsx global>{`
      .cm-page {
        min-height: 100vh;
        background: #f5f7fa;
        color: #132238;
        padding: 50px 0 100px;
      }

      .cm-container {
        width: min(1380px, calc(100% - 60px));
        margin: 0 auto;
      }

      .cm-header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 40px;
        margin-bottom: 38px;
      }

      .cm-eyebrow {
        color: #c87812;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 2.4px;
        text-transform: uppercase;
        margin-bottom: 12px;
      }

      .cm-header h1 {
        margin: 0;
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(42px, 5vw, 68px);
        line-height: 1;
        font-weight: 500;
        letter-spacing: -2px;
      }

      .cm-header p {
        max-width: 720px;
        margin: 18px 0 0;
        color: #708096;
        font-size: 17px;
        line-height: 1.7;
      }

      .cm-primary-button {
        min-height: 52px;
        border: 0;
        border-radius: 10px;
        padding: 0 22px;
        background: #101c31;
        color: white;
        font-weight: 800;
        font-size: 14px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        box-shadow: 0 12px 25px rgba(16, 28, 49, 0.16);
        transition:
          transform 0.2s ease,
          background 0.2s ease;
      }

      .cm-primary-button:hover {
        background: #182a46;
        transform: translateY(-1px);
      }

      .cm-primary-button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
        transform: none;
      }

      .cm-plus {
        font-size: 20px;
        line-height: 1;
      }

      .cm-info-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        border: 1px solid #dde3eb;
        background: white;
        margin-bottom: 28px;
      }

      .cm-info-card {
        min-height: 145px;
        padding: 28px 30px;
        display: flex;
        gap: 20px;
        border-right: 1px solid #dde3eb;
      }

      .cm-info-card:last-child {
        border-right: 0;
      }

      .cm-info-number {
        color: #c87812;
        font-size: 13px;
        font-weight: 900;
        letter-spacing: 1px;
      }

      .cm-info-card strong {
        display: block;
        font-size: 18px;
        margin-bottom: 8px;
      }

      .cm-info-card p {
        margin: 0;
        color: #718096;
        line-height: 1.6;
        font-size: 14px;
      }

      .cm-filter-panel {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 130px;
        gap: 16px;
        background: white;
        border: 1px solid #dde3eb;
        padding: 22px;
        margin-bottom: 28px;
      }

      .cm-filter {
        min-width: 0;
      }

      .cm-filter label {
        display: block;
        margin-bottom: 8px;
        color: #75859b;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 1.6px;
      }

      .cm-filter select,
      .cm-filter input {
        width: 100%;
        height: 48px;
        border: 1px solid #d4dce6;
        border-radius: 8px;
        background: white;
        padding: 0 14px;
        color: #1a2940;
        font-size: 14px;
        outline: none;
      }

      .cm-filter select:focus,
      .cm-filter input:focus {
        border-color: #b9781e;
        box-shadow: 0 0 0 3px rgba(185, 120, 30, 0.08);
      }

      .cm-total {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
      }

      .cm-total span {
        color: #8391a3;
        font-size: 10px;
        letter-spacing: 1.7px;
        font-weight: 900;
      }

      .cm-total strong {
        margin-top: 4px;
        font-size: 28px;
      }

      .cm-course-summary {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #101c31;
        color: white;
        padding: 32px 36px;
        margin-bottom: 18px;
      }

      .cm-course-summary > div:first-child span {
        color: #d59643;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 2px;
      }

      .cm-course-summary h2 {
        margin: 8px 0 5px;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 32px;
        font-weight: 500;
      }

      .cm-course-summary p {
        margin: 0;
        color: #aeb9c8;
        font-size: 14px;
      }

      .cm-course-count {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.08);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 26px;
        font-weight: 900;
      }

      .cm-course-count small {
        font-size: 9px;
        letter-spacing: 1px;
        color: #aeb9c8;
        text-transform: uppercase;
      }

      .cm-library {
        background: white;
        border: 1px solid #dde3eb;
      }

      .cm-material-list {
        display: flex;
        flex-direction: column;
      }

      .cm-material-row {
        display: grid;
        grid-template-columns: 72px minmax(0, 1fr) 80px auto;
        align-items: center;
        gap: 22px;
        padding: 25px 28px;
        border-bottom: 1px solid #e7ebf0;
      }

      .cm-material-row:last-child {
        border-bottom: 0;
      }

      .cm-material-icon {
        width: 58px;
        height: 58px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8efe1;
        color: #b9781e;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.5px;
      }

      .cm-material-main {
        min-width: 0;
      }

      .cm-material-top {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-bottom: 7px;
      }

      .cm-type-badge {
        display: inline-flex;
        padding: 5px 9px;
        border-radius: 5px;
        background: #edf2f7;
        color: #33465e;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.8px;
        text-transform: uppercase;
      }

      .cm-status {
        display: inline-flex;
        padding: 5px 9px;
        border-radius: 5px;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.8px;
      }

      .cm-status.published {
        color: #18734a;
        background: #eaf7f0;
      }

      .cm-status.draft {
        color: #8a6a20;
        background: #fff7df;
      }

      .cm-material-main h3 {
        margin: 0;
        font-size: 19px;
        line-height: 1.35;
      }

      .cm-course-name {
        margin-top: 7px;
        color: #718096;
        font-size: 13px;
      }

      .cm-course-name strong {
        margin-left: 5px;
        color: #24354c;
      }

      .cm-slug {
        display: inline-block;
        margin-top: 6px;
        color: #a0acba;
        font-size: 11px;
        font-family: monospace;
      }

      .cm-material-main p {
        margin: 9px 0 0;
        color: #718096;
        font-size: 13px;
        line-height: 1.55;
      }

      .cm-source {
        margin-top: 8px;
        color: #9a6d29;
        font-size: 12px;
        font-weight: 800;
      }

      .cm-material-order {
        text-align: center;
      }

      .cm-material-order span {
        display: block;
        color: #98a4b3;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1.5px;
      }

      .cm-material-order strong {
        display: block;
        margin-top: 4px;
        font-size: 20px;
      }

      .cm-actions {
        display: flex;
        flex-direction: column;
        gap: 7px;
      }

      .cm-actions button {
        height: 36px;
        min-width: 75px;
        padding: 0 12px;
        border: 1px solid #d6dee8;
        border-radius: 6px;
        background: white;
        color: #23344d;
        font-weight: 800;
        cursor: pointer;
      }

      .cm-actions button:hover {
        background: #f5f7fa;
      }

      .cm-actions button.danger {
        color: #a23a3a;
        border-color: #edd2d2;
      }

      .cm-actions button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .cm-empty {
        min-height: 430px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 40px;
      }

      .cm-empty-icon {
        width: 62px;
        height: 62px;
        border-radius: 16px;
        background: #fff5e7;
        color: #c87812;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        margin-bottom: 20px;
      }

      .cm-empty h3 {
        margin: 0;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 30px;
        font-weight: 500;
      }

      .cm-empty p {
        color: #78869a;
        margin: 10px 0 24px;
      }

      /* =====================================================
         MODAL
      ===================================================== */

      .cm-modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(12, 24, 42, 0.58);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 30px;
        overflow-y: auto;
      }

      .cm-modal {
        width: min(880px, 100%);
        max-height: calc(100vh - 60px);
        overflow-y: auto;
        background: white;
        border-radius: 20px;
        box-shadow: 0 35px 100px rgba(0, 0, 0, 0.28);
      }

      .cm-modal-header {
        position: sticky;
        top: 0;
        z-index: 2;
        background: white;
        border-bottom: 1px solid #e6ebf0;
        padding: 28px 32px;
        display: flex;
        justify-content: space-between;
        gap: 25px;
      }

      .cm-modal-header h2 {
        margin: 0;
        font-size: 27px;
      }

      .cm-modal-header p {
        margin: 8px 0 0;
        color: #78869a;
        line-height: 1.5;
        font-size: 14px;
      }

      .cm-close {
        width: 44px;
        height: 44px;
        flex: 0 0 44px;
        border: 0;
        border-radius: 10px;
        background: #f1f4f7;
        color: #617188;
        font-size: 29px;
        cursor: pointer;
        line-height: 1;
      }

      .cm-close:hover {
        background: #e7ebf0;
      }

      .cm-form {
        padding: 30px 32px 34px;
      }

      .cm-field {
        margin-bottom: 22px;
      }

      .cm-field label,
      .cm-upload-label {
        display: block;
        margin-bottom: 8px;
        color: #28374c;
        font-size: 12px;
        font-weight: 900;
      }

      .cm-field label span,
      .cm-upload-label span {
        color: #bd6514;
        margin-left: 4px;
      }

      .cm-field input,
      .cm-field select,
      .cm-field textarea,
      .cm-special-box input {
        width: 100%;
        border: 1px solid #d2dbe6;
        border-radius: 9px;
        background: white;
        color: #1b2b42;
        font-size: 15px;
        outline: none;
        transition: border-color 0.2s ease;
      }

      .cm-field input,
      .cm-field select,
      .cm-special-box input {
        height: 52px;
        padding: 0 15px;
      }

      .cm-field textarea {
        padding: 14px 15px;
        resize: vertical;
        line-height: 1.6;
      }

      .cm-field input:focus,
      .cm-field select:focus,
      .cm-field textarea:focus,
      .cm-special-box input:focus {
        border-color: #bd7b2c;
        box-shadow: 0 0 0 3px rgba(189, 123, 44, 0.08);
      }

      .cm-help {
        display: block;
        margin-top: 7px;
        color: #8995a6;
        font-size: 11px;
        line-height: 1.5;
      }

      .cm-two-columns {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
      }

      /* =====================================================
         SPECIAL CONTENT BOX
      ===================================================== */

      .cm-special-box {
        margin-bottom: 24px;
        padding: 22px;
        border: 1px solid #dce3eb;
        border-radius: 12px;
        background: #f9fafc;
      }

      .cm-special-heading {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 20px;
      }

      .cm-special-icon {
        width: 48px;
        height: 48px;
        flex: 0 0 48px;
        border-radius: 10px;
        background: #fff0dd;
        color: #b96f18;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 900;
      }

      .cm-special-icon.live {
        background: #eaf8f1;
        color: #17764b;
      }

      .cm-special-heading strong {
        display: block;
        font-size: 15px;
      }

      .cm-special-heading p {
        margin: 4px 0 0;
        color: #7d8999;
        font-size: 12px;
      }

      .cm-file {
        width: 100%;
        padding: 14px;
        border: 1px dashed #c8d2df;
        border-radius: 8px;
        background: white;
        color: #45566e;
      }

      .cm-selected-file {
        margin-top: 10px;
        padding: 10px 12px;
        background: #edf8f2;
        border-radius: 7px;
        color: #26734e;
        font-size: 12px;
      }

      .cm-or {
        margin: 17px 0;
        text-align: center;
        color: #a0a9b5;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 1.5px;
      }

      .cm-live-tip {
        margin-top: 9px;
        color: #7b8797;
        font-size: 11px;
      }

      /* =====================================================
         ALERTS
      ===================================================== */

      .cm-alert {
        padding: 13px 15px;
        border-radius: 8px;
        margin-bottom: 18px;
        font-size: 13px;
        font-weight: 700;
      }

      .cm-alert.error {
        color: #9e3737;
        background: #fff0f0;
        border: 1px solid #f0d2d2;
      }

      .cm-alert.success {
        color: #176d47;
        background: #ecf8f1;
        border: 1px solid #cde8d9;
      }

      .cm-form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding-top: 10px;
        border-top: 1px solid #e8edf2;
      }

      .cm-secondary-button {
        min-height: 52px;
        padding: 0 20px;
        border: 1px solid #d3dce7;
        border-radius: 9px;
        background: white;
        color: #33445b;
        font-weight: 800;
        cursor: pointer;
      }

      .cm-secondary-button:hover {
        background: #f6f8fa;
      }

      .cm-secondary-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .cm-loading-page {
        min-height: 650px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      }

      .cm-loader {
        width: 42px;
        height: 42px;
        border: 4px solid #e8edf3;
        border-top-color: #b9781e;
        border-radius: 50%;
        animation: cm-spin 0.8s linear infinite;
        margin-bottom: 20px;
      }

      .cm-loading-page h2 {
        margin: 0;
        font-size: 22px;
      }

      .cm-loading-page p {
        color: #7a8798;
      }

      @keyframes cm-spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* =====================================================
         RESPONSIVE
      ===================================================== */

      @media (max-width: 1050px) {
        .cm-filter-panel {
          grid-template-columns: 1fr 1fr;
        }

        .cm-total {
          align-items: flex-start;
        }

        .cm-material-row {
          grid-template-columns: 60px minmax(0, 1fr) auto;
        }

        .cm-material-order {
          display: none;
        }

        .cm-actions {
          flex-direction: row;
        }
      }

      @media (max-width: 800px) {
        .cm-container {
          width: min(100% - 30px, 680px);
        }

        .cm-page {
          padding-top: 30px;
        }

        .cm-header {
          align-items: flex-start;
          flex-direction: column;
        }

        .cm-info-grid {
          grid-template-columns: 1fr;
        }

        .cm-info-card {
          border-right: 0;
          border-bottom: 1px solid #dde3eb;
        }

        .cm-info-card:last-child {
          border-bottom: 0;
        }

        .cm-course-summary {
          align-items: flex-start;
          gap: 20px;
        }

        .cm-material-row {
          grid-template-columns: 52px 1fr;
        }

        .cm-actions {
          grid-column: 2;
          justify-content: flex-start;
        }

        .cm-material-icon {
          width: 52px;
          height: 52px;
        }
      }

      @media (max-width: 620px) {
        .cm-filter-panel {
          grid-template-columns: 1fr;
        }

        .cm-total {
          align-items: flex-start;
        }

        .cm-two-columns {
          grid-template-columns: 1fr;
        }

        .cm-modal-backdrop {
          padding: 0;
        }

        .cm-modal {
          width: 100%;
          max-height: 100vh;
          min-height: 100vh;
          border-radius: 0;
        }

        .cm-modal-header,
        .cm-form {
          padding-left: 20px;
          padding-right: 20px;
        }

        .cm-form-actions {
          flex-direction: column-reverse;
        }

        .cm-form-actions button {
          width: 100%;
        }

        .cm-header h1 {
          font-size: 45px;
        }

        .cm-course-summary {
          padding: 25px;
        }

        .cm-course-count {
          width: 62px;
          height: 62px;
          font-size: 20px;
        }
      }
    `}</style>
  );
}