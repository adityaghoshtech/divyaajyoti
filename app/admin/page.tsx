"use client";

import "./admin.css";

import {
  FormEvent,
  ReactNode,
  useMemo,
  useState,
} from "react";

import {
  useMutation,
  useQuery,
} from "convex/react";

import { api } from "../../convex/_generated/api";

import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  Edit3,
  GraduationCap,
  LayoutDashboard,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Users,
  Video,
  WalletCards,
  X,
} from "lucide-react";

// =========================================================
// TYPES
// =========================================================

type TableName =
  | "properties"
  | "courses"
  | "courseMaterials"
  | "events"
  | "leads"
  | "consultations"
  | "siteVisits"
  | "courseEnrollments"
  | "payments"
  | "propertyCategories";

type Tab =
  | "overview"
  | TableName;

// =========================================================
// NAVIGATION
// =========================================================

const nav: {
  id: Tab;
  label: string;
  icon: any;
  group: string;
}[] = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    group: "Workspace",
  },
  {
    id: "properties",
    label: "Properties",
    icon: Building2,
    group: "Content",
  },
  {
    id: "propertyCategories",
    label: "Property Categories",
    icon: Building2,
    group: "Content",
  },
  {
    id: "courses",
    label: "Courses",
    icon: GraduationCap,
    group: "Content",
  },
  {
    id: "courseMaterials",
    label: "Course Materials",
    icon: Video,
    group: "Content",
  },
  {
    id: "events",
    label: "Events",
    icon: CalendarDays,
    group: "Content",
  },
  {
    id: "leads",
    label: "Leads / CRM",
    icon: Users,
    group: "Customers",
  },
  {
    id: "consultations",
    label: "Consultations",
    icon: Sparkles,
    group: "Customers",
  },
  {
    id: "siteVisits",
    label: "Site Visits",
    icon: Building2,
    group: "Customers",
  },
  {
    id: "courseEnrollments",
    label: "Enrollments",
    icon: GraduationCap,
    group: "Commerce",
  },
  {
    id: "payments",
    label: "Payments",
    icon: WalletCards,
    group: "Commerce",
  },
];

// =========================================================
// HELPERS
// =========================================================

const label = (id: Tab) =>
  nav.find((x) => x.id === id)?.label ?? id;

const money = (value: unknown) =>
  `₹${Number(value ?? 0).toLocaleString("en-IN")}`;

const pretty = (value: unknown) =>
  String(value ?? "—")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (x) => x.toUpperCase());

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// =========================================================
// ADMIN PAGE
// =========================================================

export default function AdminPage() {
  const [tab, setTab] =
    useState<Tab>("overview");

  const [search, setSearch] =
    useState("");

  const [editor, setEditor] =
    useState<{
      table: TableName;
      id?: string;
    } | null>(null);

  const [categoryEditor, setCategoryEditor] =
    useState(false);

  const overview = useQuery(
    api.admin.overview,
  );

  const rows = useQuery(
    api.admin.list,
    tab === "overview"
      ? "skip"
      : {
          table: tab,
        },
  );

  const categories = useQuery(
    api.admin.listCategories,
  );

  const remove = useMutation(
    api.admin.remove,
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!rows || !q) {
      return rows ?? [];
    }

    return rows.filter((row: any) =>
      JSON.stringify(row)
        .toLowerCase()
        .includes(q),
    );
  }, [rows, search]);

  const openTab = (next: Tab) => {
    setTab(next);
    setSearch("");
  };

  return (
    <div className="dj-admin">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="dj-sidebar">

        <div className="dj-brand">

          <div className="dj-logo">
            D
          </div>

          <div>
            <strong>
              DIVYAJYOTI
            </strong>

            <small>
              SUPER ADMIN
            </small>
          </div>

        </div>

        <div className="dj-nav">

          {Array.from(
            new Set(
              nav.map(
                (item) => item.group,
              ),
            ),
          ).map((group) => (

            <div key={group}>

              <p>
                {group}
              </p>

              {nav
                .filter(
                  (item) =>
                    item.group === group,
                )
                .map((item) => {

                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      className={
                        tab === item.id
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        openTab(item.id)
                      }
                    >
                      <Icon size={16} />

                      <span>
                        {item.label}
                      </span>
                    </button>
                  );
                })}

            </div>
          ))}

        </div>

      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="dj-main">

        <div className="dj-topbar">

          <div>

            <span className="dj-kicker">
              DIVYAJYOTI ADMIN
            </span>

            <h1>
              {label(tab)}
            </h1>

          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
          >
            View website
            <ArrowUpRight size={14} />
          </a>

        </div>

        {/* OVERVIEW */}

        {tab === "overview" ? (

          <Overview
            data={overview}
            onOpen={openTab}
          />

        ) : (

          <>
            <div className="dj-page-head">

              <div>

                <span className="dj-kicker">
                  FULL MANAGEMENT ACCESS
                </span>

                <h2>
                  {label(tab)}
                </h2>

                <p>
                  {tab === "courseMaterials"
                    ? "Upload and publish recorded classes, PDFs, notes, Google Meet links and other private course resources."
                    : "Manage your Divyajyoti website data directly from this panel."}
                </p>

              </div>

              <button
                className="dj-primary"
                onClick={() => {

                  if (
                    tab ===
                    "propertyCategories"
                  ) {
                    setCategoryEditor(true);
                    return;
                  }

                  setEditor({
                    table: tab,
                  });

                }}
              >
                <Plus size={17} />

                Add{" "}

                {tab ===
                "propertyCategories"
                  ? "category"
                  : label(tab)
                      .replace(
                        " / CRM",
                        "",
                      )
                      .replace(
                        /s$/,
                        "",
                      )}
              </button>

            </div>

            {/* TOOLBAR */}

            <div className="dj-toolbar">

              <div className="dj-search">

                <Search size={17} />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder={`Search ${label(
                    tab,
                  ).toLowerCase()}...`}
                />

              </div>

            </div>

            {/* TABLE */}

            <DataTable
              table={tab}
              rows={
                filtered as any[]
              }
              categories={
                (categories ??
                  []) as any[]
              }
              onEdit={(id) => {

                if (
                  tab ===
                  "propertyCategories"
                ) {
                  setCategoryEditor(true);
                  return;
                }

                setEditor({
                  table: tab,
                  id,
                });

              }}
              onDelete={async (id) => {

                const confirmed =
                  window.confirm(
                    "Delete this record permanently?",
                  );

                if (!confirmed) {
                  return;
                }

                await remove({
                  table: tab,
                  id,
                });

              }}
            />

          </>
        )}

      </main>

      {/* =====================================================
          EDITOR
      ===================================================== */}

      {editor && (
        <RecordEditor
          table={editor.table}
          id={editor.id}
          rows={
            (rows ?? []) as any[]
          }
          categories={
            (categories ??
              []) as any[]
          }
          onClose={() =>
            setEditor(null)
          }
        />
      )}

      {/* =====================================================
          CATEGORY EDITOR
      ===================================================== */}

      {categoryEditor && (
        <CategoryEditor
          rows={
            (categories ??
              []) as any[]
          }
          onClose={() =>
            setCategoryEditor(false)
          }
        />
      )}

    </div>
  );
}

// =========================================================
// OVERVIEW
// =========================================================

function Overview({
  data,
  onOpen,
}: {
  data: any;
  onOpen: (tab: Tab) => void;
}) {
  if (!data) {
    return (
      <div className="dj-loading">
        Loading command centre...
      </div>
    );
  }

  const cards = [
    [
      "Properties",
      data.properties,
      "properties",
    ],
    [
      "Courses",
      data.courses,
      "courses",
    ],
    [
      "New Leads",
      data.newLeads,
      "leads",
    ],
    [
      "Follow-ups",
      data.followUps,
      "leads",
    ],
    [
      "Consultations",
      data.consultations,
      "consultations",
    ],
    [
      "Site Visits",
      data.siteVisits,
      "siteVisits",
    ],
    [
      "Enrollments",
      data.enrollments,
      "courseEnrollments",
    ],
    [
      "Payments",
      data.payments,
      "payments",
    ],
  ];

  return (
    <section>

      <div className="dj-welcome">

        <div>

          <span className="dj-kicker">
            COMMAND CENTRE
          </span>

          <h2>
            Everything in one place.
          </h2>

          <p>
            Manage properties, learning,
            events, customers, consultations
            and payments from one workspace.
          </p>

        </div>

      </div>

      {/* METRICS */}

      <div className="dj-metrics admin-8">

        {cards.map(
          ([name, value, id]) => (

            <button
              key={
                String(id) +
                String(name)
              }
              className="dj-metric"
              onClick={() =>
                onOpen(id as Tab)
              }
            >

              <small>
                {name}
              </small>

              <strong>
                {value}
              </strong>

              <span>
                Open manager
                <ChevronRight size={13} />
              </span>

            </button>

          ),
        )}

      </div>

      {/* BUSINESS SUMMARY */}

      <div className="dj-panel">

        <h3>
          Business summary
        </h3>

        <div className="dj-capabilities">

          <span>
            <Building2 size={14} />
            {data.activeProperties} active
            properties
          </span>

          <span>
            <GraduationCap size={14} />
            {data.publishedCourses} published
            courses
          </span>

          <span>
            <CalendarDays size={14} />
            {data.upcomingEvents} upcoming
            events
          </span>

          <span>
            <Users size={14} />
            {data.qualifiedLeads} qualified
            leads
          </span>

          <span>
            <Check size={14} />
            {data.convertedLeads} converted
            leads
          </span>

          <span>
            <WalletCards size={14} />
            {money(data.revenue)} paid revenue
          </span>

        </div>

      </div>

      {/* CAPABILITIES */}

      <div className="dj-panel">

        <h3>
          Super Admin capabilities
        </h3>

        <div className="dj-capabilities">

          <span>
            <Check size={14} />
            Add records
          </span>

          <span>
            <Check size={14} />
            Edit records
          </span>

          <span>
            <Check size={14} />
            Publish / draft
          </span>

          <span>
            <Check size={14} />
            Manage images
          </span>

          <span>
            <Check size={14} />
            Manage CRM
          </span>

          <span>
            <Check size={14} />
            Follow-up tracking
          </span>

          <span>
            <Check size={14} />
            Payment tracking
          </span>

          <span>
            <Check size={14} />
            Property categories
          </span>

        </div>

      </div>

    </section>
  );
}

// =========================================================
// ENROLLMENT ACTIONS
// =========================================================

function EnrollmentActions({
  enrollment,
  onEdit,
  onDelete,
}: {
  enrollment: any;
  onEdit: () => void;
  onDelete: () => void;
}) {

  const approvePayment =
    useMutation(
      api.coursePayments
        .approvePayment,
    );

  const rejectPayment =
    useMutation(
      api.coursePayments
        .rejectPayment,
    );

  const resetToPending =
    useMutation(
      api.coursePayments
        .resetToPending,
    );


  const [
    loading,
    setLoading,
  ] = useState<
    "approve" |
    "reject" |
    "reset" |
    null
  >(null);


  /* =======================================================
     STATUS
  ======================================================= */

  const status =
    String(
      enrollment.status ?? "",
    ).toUpperCase();


  /* =======================================================
     APPROVE
  ======================================================= */

  const handleApprove =
    async () => {

      const confirmed =
        window.confirm(
          `Approve payment for ${enrollment.name}?`,
        );

      if (!confirmed) {
        return;
      }


      try {

        setLoading(
          "approve",
        );


        const result =
          await approvePayment({
            enrollmentId: enrollment._id,
          });


        console.log(
          "APPROVE RESULT:",
          result,
        );


        if (
          result.status !==
          "APPROVED"
        ) {
          throw new Error(
            "Convex did not return APPROVED status.",
          );
        }


        alert(
          "Payment approved successfully.",
        );

      } catch (error) {

        console.error(
          "APPROVE PAYMENT ERROR:",
          error,
        );


        alert(
          error instanceof Error
            ? error.message
            : "Failed to approve payment.",
        );

      } finally {

        setLoading(
          null,
        );
      }
    };


  /* =======================================================
     REJECT
  ======================================================= */

  const handleReject =
    async () => {

      const reason =
        window.prompt(
          "Enter the reason for rejecting this payment:",
        );


      if (!reason?.trim()) {
        return;
      }


      try {

        setLoading(
          "reject",
        );


        const result =
          await rejectPayment({
            enrollmentId:
              enrollment._id,
          });


        console.log(
          "REJECT RESULT:",
          result,
        );


        alert(
          "Payment rejected.",
        );

      } catch (error) {

        console.error(
          "REJECT PAYMENT ERROR:",
          error,
        );


        alert(
          error instanceof Error
            ? error.message
            : "Failed to reject payment.",
        );

      } finally {

        setLoading(
          null,
        );
      }
    };


  /* =======================================================
     RESET
  ======================================================= */

  const handleReset =
    async () => {

      const confirmed =
        window.confirm(
          "Move this enrollment back to pending?",
        );


      if (!confirmed) {
        return;
      }


      try {

        setLoading(
          "reset",
        );


        const result =
          await resetToPending({
            enrollmentId:
              enrollment._id,
          });


        console.log(
          "RESET RESULT:",
          result,
        );


        alert(
          "Enrollment moved back to pending.",
        );

      } catch (error) {

        console.error(
          "RESET PAYMENT ERROR:",
          error,
        );


        alert(
          error instanceof Error
            ? error.message
            : "Failed to reset enrollment.",
        );

      } finally {

        setLoading(
          null,
        );
      }
    };


  /* =======================================================
     ACTIONS
  ======================================================= */

  return (
    <div className="enrollment-actions">

      {/* PAYMENT PROOF */}

      {enrollment.paymentProofUrl && (
        <a
          href={
            enrollment.paymentProofUrl
          }
          target="_blank"
          rel="noreferrer"
          className="enrollment-proof-btn"
        >
          View Proof
        </a>
      )}


      {/* ===================================================
          PENDING
      =================================================== */}

      {status === "PENDING" && (
        <>

          <button
            className="enrollment-approve"
            onClick={
              handleApprove
            }
            disabled={
              loading !== null
            }
          >

            <Check
              size={14}
            />

            {loading ===
            "approve"
              ? "Approving..."
              : "Approve"}

          </button>


          <button
            className="enrollment-reject"
            onClick={
              handleReject
            }
            disabled={
              loading !== null
            }
          >

            <X
              size={14}
            />

            {loading ===
            "reject"
              ? "Rejecting..."
              : "Reject"}

          </button>

        </>
      )}


      {/* ===================================================
          APPROVED
      =================================================== */}

      {status === "APPROVED" && (
        <>

          <span className="enrollment-approved">

            <Check
              size={14}
            />

            Approved

          </span>


          <button
            className="enrollment-reset"
            onClick={
              handleReset
            }
            disabled={
              loading !== null
            }
          >

            {loading ===
            "reset"
              ? "Resetting..."
              : "Reset"}

          </button>

        </>
      )}


      {/* ===================================================
          REJECTED
      =================================================== */}

      {status === "REJECTED" && (
        <>

          <span className="enrollment-rejected">

            <X
              size={14}
            />

            Rejected

          </span>


          <button
            className="enrollment-reset"
            onClick={
              handleReset
            }
            disabled={
              loading !== null
            }
          >

            {loading ===
            "reset"
              ? "Resetting..."
              : "Move to Pending"}

          </button>

        </>
      )}


      {/* ===================================================
          EDIT
      =================================================== */}

      <button
        className="enrollment-edit"
        onClick={onEdit}
      >

        <Edit3
          size={14}
        />

        Edit

      </button>


      {/* ===================================================
          DELETE
      =================================================== */}

      <button
        className="enrollment-delete"
        onClick={onDelete}
      >

        <Trash2
          size={14}
        />

        Delete

      </button>

    </div>
  );
}


// =========================================================
// DATA TABLE
// =========================================================

function DataTable({
  table,
  rows,
  categories,
  onEdit,
  onDelete,
}: {
  table: TableName;
  rows: any[];
  categories: any[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (!rows.length) {
    return (
      <div className="dj-empty">

        <h2>
          No {label(table).toLowerCase()} yet.
        </h2>

        <p>
          {table === "courseMaterials"
            ? "Use Add Course Materials to publish a video, PDF, note, Google Meet link or resource for a course."
            : "Use the Add button to create the first record."}
        </p>

      </div>
    );
  }

  const fields = tableFields(table);

  return (
    <div className="dj-table-wrap">

      <table>

        <thead>

          <tr>

            {fields.map((f) => (
              <th key={f.key}>
                {f.label}
              </th>
            ))}

            <th>
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {rows.map((row) => (

            <tr key={row._id}>

              {fields.map((f) => (

                <td key={f.key}>

                  {renderCell(
                    row[f.key],
                    f.key,
                    row,
                    categories,
                  )}

                </td>

              ))}

              <td>

                {table ===
                "courseEnrollments" ? (

                  <EnrollmentActions
                    enrollment={row}
                    onEdit={() =>
                      onEdit(row._id)
                    }
                    onDelete={() =>
                      onDelete(row._id)
                    }
                  />

                ) : (

                  <div className="dj-actions">

                    <button
                      onClick={() =>
                        onEdit(row._id)
                      }
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>

                    <button
                      className="danger"
                      onClick={() =>
                        onDelete(row._id)
                      }
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>

                  </div>

                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

// =========================================================
// TABLE COLUMNS
// =========================================================

function tableFields(
  table: TableName,
) {
  const common = (
    fields: [string, string][],
  ) =>
    fields.map(
      ([key, label]) => ({
        key,
        label,
      }),
    );

  switch (table) {

    case "properties":
      return common([
        ["title", "Title"],
        ["type", "Category"],
        ["location", "Location"],
        ["price", "Price"],
        ["beds", "Beds"],
        ["baths", "Baths"],
        ["area", "Area"],
        ["status", "Status"],
      ]);

    case "courses":
      return common([
        ["title", "Title"],
        ["category", "Category"],
        ["duration", "Duration"],
        ["level", "Level"],
        ["price", "Price"],
        ["status", "Status"],
        ["instructor", "Instructor"],
      ]);

    case "courseMaterials":
      return common([
        ["title", "Title"],
        ["courseSlug", "Course"],
        ["type", "Type"],
        ["sortOrder", "Order"],
        ["status", "Status"],
      ]);

    case "events":
      return common([
        ["title", "Title"],
        ["date", "Date"],
        ["place", "Place"],
        ["status", "Status"],
      ]);

    case "leads":
      return common([
        ["name", "Name"],
        ["phone", "Phone"],
        ["email", "Email"],
        ["source", "Source"],
        ["interest", "Interest"],
        ["priority", "Priority"],
        ["status", "Status"],
        ["followUpAt", "Follow-up"],
      ]);

    case "consultations":
      return common([
        ["name", "Name"],
        ["phone", "Phone"],
        ["email", "Email"],
        ["service", "Service"],
        ["status", "Status"],
      ]);

    case "siteVisits":
      return common([
        ["name", "Name"],
        ["phone", "Phone"],
        ["propertyId", "Property"],
        ["preferredDate", "Date"],
        ["status", "Status"],
      ]);

    case "courseEnrollments":
      return common([
        ["name", "Name"],
        ["email", "Email"],
        ["phone", "Phone"],
        ["courseTitle", "Course"],
        ["amount", "Amount"],
        [
          "paymentReference",
          "UTR / Reference",
        ],
        ["status", "Status"],
      ]);

    case "payments":
      return common([
        ["name", "Name"],
        ["email", "Email"],
        ["courseTitle", "Course"],
        ["amount", "Amount"],
        ["paymentId", "Payment ID"],
        ["status", "Status"],
      ]);

    case "propertyCategories":
      return common([
        ["name", "Name"],
        ["slug", "Slug"],
        ["status", "Status"],
      ]);
  }
}

// =========================================================
// CELL RENDERING
// =========================================================

function renderCell(
  value: any,
  key: string,
  row: any,
  categories: any[],
) {
  if (
    key === "price" ||
    key === "amount"
  ) {
    return money(value);
  }

  if (
    key === "type" &&
    value
  ) {
    return (
      <span className="dj-pill">
        {pretty(value)}
      </span>
    );
  }

  if (
    key === "priority" &&
    value
  ) {
    return (
      <span className="dj-pill">
        {pretty(value)}
      </span>
    );
  }

  if (
    key === "status"
  ) {
    return (
      <span
        className={`dj-status-pill ${String(
          value,
        )
          .toLowerCase()
          .replaceAll(
            " ",
            "-",
          )}`}
      >
        {pretty(value)}
      </span>
    );
  }

  if (
    key === "category" &&
    categories.some(
      (x) => x.name === value,
    )
  ) {
    return (
      <span className="dj-pill">
        {value}
      </span>
    );
  }

  if (
    key
      .toLowerCase()
      .includes("at") ||
    key === "preferredDate"
  ) {
    return value
      ? new Date(
          Number(value),
        ).toLocaleString(
          "en-IN",
        )
      : "—";
  }

  if (
    Array.isArray(value)
  ) {
    return value.join(", ");
  }

  const text = String(
    value ?? "—",
  );

  return text.length > 70
    ? `${text.slice(0, 70)}…`
    : text;
}

// =========================================================
// RECORD EDITOR
// =========================================================

function RecordEditor({
  table,
  id,
  rows,
  categories,
  onClose,
}: {
  table: TableName;
  id?: string;
  rows: any[];
  categories: any[];
  onClose: () => void;
}) {
  const existing = id
    ? rows.find(
        (row) =>
          row._id === id,
      )
    : null;

  const create =
    useMutation(
      api.admin.create,
    );

  const update =
    useMutation(
      api.admin.update,
    );

  const generateUploadUrl =
    useMutation(
      api.admin.generateUploadUrl,
    );

  const attachImages =
    useMutation(
      api.admin.attachImages,
    );

  const [form, setForm] =
    useState<any>(() =>
      makeInitial(
        table,
        existing,
        categories,
      ),
    );

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const set = (
    key: string,
    value: any,
  ) => {
    setForm(
      (current: any) => ({
        ...current,
        [key]: value,
      }),
    );
  };

  const submit = async (
    event: FormEvent,
  ) => {

    event.preventDefault();

    setSaving(true);
    setError("");

    try {

      const data =
        cleanForm(
          table,
          form,
        );

      /*
       * COURSE MATERIAL FILE
       *
       * A course material has one primary
       * uploaded file. We store its Convex
       * Storage ID directly on the record.
       */
      if (
        table ===
        "courseMaterials"
      ) {

        const materialFile =
          form.materialFile as
            | File
            | undefined;

        if (materialFile) {

          const uploadUrl =
            await generateUploadUrl(
              {},
            );

          const response =
            await fetch(
              uploadUrl,
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    materialFile.type ||
                    "application/octet-stream",
                },
                body: materialFile,
              },
            );

          if (!response.ok) {
            throw new Error(
              `Material upload failed: ${materialFile.name}`,
            );
          }

          const result =
            await response.json();

          if (!result.storageId) {
            throw new Error(
              "Convex did not return a storage ID for the uploaded material.",
            );
          }

          data.storageId =
            result.storageId;
        }

        delete data.materialFile;
      }

      delete data.photoFiles;

      let recordId:
        | string
        | undefined =
        existing?._id;

      if (existing) {

        await update({
          table,
          id: existing._id,
          patch: data,
        });

      } else {

        recordId =
          (await create({
            table,
            data,
          })) as string;
      }

      /*
       * PROPERTY / COURSE / EVENT IMAGE UPLOAD
       *
       * These continue using the existing
       * attachImages workflow.
       */
      const selectedFiles =
        (form.photoFiles ??
          []) as File[];

      if (
        recordId &&
        selectedFiles.length &&
        (
          table ===
            "properties" ||
          table ===
            "courses" ||
          table ===
            "events"
        )
      ) {

        const storageIds:
          string[] = [];

        for (
          const file of selectedFiles
        ) {

          const uploadUrl =
            await generateUploadUrl(
              {},
            );

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
              `Photo upload failed: ${file.name}`,
            );
          }

          const result =
            await response.json();

          storageIds.push(
            result.storageId,
          );
        }

        await attachImages({
          table,
          id: recordId,
          storageIds,
        });
      }

      onClose();

    } catch (err: any) {

      setError(
        err?.message ||
          "Unable to save record.",
      );

    } finally {

      setSaving(false);

    }
  };

  const fields =
    editorFields(table);

  return (
    <Modal
      title={
        existing
          ? `Edit ${label(table)}`
          : `Add ${label(table)}`
      }
      onClose={onClose}
    >

      <form
        onSubmit={submit}
      >

        {error && (

          <div
            style={{
              margin:
                "15px 20px 0",
              padding:
                "10px 12px",
              borderRadius: 8,
              background:
                "#fef2f2",
              color:
                "#b91c1c",
              fontSize: 12,
            }}
          >
            {error}
          </div>

        )}

        <div className="dj-form-grid">

          {fields.map(
            (field) => (

              <Field
                key={field.key}
                field={field}
                value={
                  form[field.key]
                }
                onChange={(
                  value,
                ) =>
                  set(
                    field.key,
                    value,
                  )
                }
                categories={
                  categories
                }
                table={table}
              />

            ),
          )}

        </div>

        <div className="dj-modal-actions">

          <button
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="dj-primary"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save changes"}
          </button>

        </div>

      </form>

    </Modal>
  );
}

// =========================================================
// CATEGORY EDITOR
// =========================================================

function CategoryEditor({
  rows,
  onClose,
}: {
  rows: any[];
  onClose: () => void;
}) {
  const create =
    useMutation(
      api.admin.create,
    );

  const update =
    useMutation(
      api.admin.update,
    );

  const [id, setId] =
    useState<string>();

  const [name, setName] =
    useState("");

  const [status, setStatus] =
    useState("active");

  const existing =
    rows.find(
      (row) =>
        row._id === id,
    );

  const startEdit = (
    row: any,
  ) => {
    setId(row._id);
    setName(row.name);
    setStatus(
      row.status ??
        "active",
    );
  };

  const save = async () => {

    const cleanName =
      name.trim();

    if (!cleanName) {
      return;
    }

    const slug =
      slugify(
        cleanName,
      );

    if (existing) {

      await update({
        table:
          "propertyCategories",
        id: existing._id,
        patch: {
          name: cleanName,
          slug,
          status,
        },
      });

    } else {

      await create({
        table:
          "propertyCategories",
        data: {
          name: cleanName,
          slug,
          status,
        },
      });

    }

    setId(undefined);
    setName("");

  };

  return (
    <Modal
      title="Property categories"
      onClose={onClose}
    >

      <div className="category-manager">

        <p>
          Create property types such as
          Villa, Apartment, Bungalow,
          Land, Plot or Commercial.
        </p>

        {rows.map(
          (row) => (

            <div
              className="category-row"
              key={row._id}
            >

              <span>

                <b>
                  {row.name}
                </b>

                <small>
                  {row.slug}
                </small>

              </span>

              <button
                onClick={() =>
                  startEdit(row)
                }
              >

                <Edit3 size={14} />

                Edit

              </button>

            </div>

          ),
        )}

        <div className="category-add">

          <input
            value={name}
            onChange={(event) =>
              setName(
                event.target.value,
              )
            }
            placeholder={
              id
                ? "Edit category name"
                : "New category name"
            }
          />

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value,
              )
            }
          >

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>

          </select>

          <button
            type="button"
            className="dj-primary"
            onClick={save}
          >
            {id
              ? "Update"
              : "Add"}
          </button>

        </div>

      </div>

    </Modal>
  );
}

// =========================================================
// FIELD
// =========================================================

function Field({
  field,
  value,
  onChange,
  categories,
  table,
}: {
  field: any;
  value: any;
  onChange: (value: any) => void;
  categories: any[];
  table: TableName;
}) {

  // =======================================================
  // DESCRIPTION / MESSAGE / LONG TEXT
  // =======================================================

  if (
    field.key === "description" ||
    field.key === "message" ||
    field.key === "notes" ||
    [
      "overview",
      "vastuDescription",
      "walkthroughDescription",
      "contactDescription",
    ].includes(field.key)
  ) {
    return (
      <div className="dj-field full">
        <span>{field.label}</span>

        <textarea
          rows={5}
          value={value ?? ""}
          placeholder={field.placeholder ?? ""}
          onChange={(event) =>
            onChange(event.target.value)
          }
        />
      </div>
    );
  }

  // =======================================================
  // COURSE MATERIAL TYPE
  // =======================================================

  if (
    table === "courseMaterials" &&
    field.key === "type"
  ) {
    return (
      <div className="dj-field">
        <span>{field.label}</span>

        <select
          required={field.required}
          value={value ?? ""}
          onChange={(event) =>
            onChange(event.target.value)
          }
        >
          <option value="">
            Select material type
          </option>

          <option value="RECORDED_CLASS">
            Recorded Class
          </option>

          <option value="PDF">
            PDF
          </option>

          <option value="NOTE">
            Notes / Document
          </option>

          <option value="LIVE_CLASS">
            Live Class
          </option>

          <option value="GOOGLE_MEET">
            Google Meet
          </option>

          <option value="VIDEO_LINK">
            Video Link
          </option>

          <option value="LINK">
            External Link
          </option>

          <option value="RESOURCE">
            Other Resource
          </option>
        </select>
      </div>
    );
  }

  // =======================================================
  // COURSE MATERIAL STATUS
  // =======================================================

  if (
    table === "courseMaterials" &&
    field.key === "status"
  ) {
    return (
      <div className="dj-field">
        <span>{field.label}</span>

        <select
          value={
            String(value ?? "DRAFT").toUpperCase()
          }
          onChange={(event) =>
            onChange(event.target.value)
          }
        >
          <option value="DRAFT">
            Draft
          </option>

          <option value="PUBLISHED">
            Published
          </option>
        </select>
      </div>
    );
  }

  // =======================================================
  // PROPERTY TYPE
  // =======================================================

  if (
    table === "properties" &&
    field.key === "type"
  ) {
    return (
      <div className="dj-field">
        <span>{field.label}</span>

        <select
          required={field.required}
          value={value ?? ""}
          onChange={(event) =>
            onChange(event.target.value)
          }
        >
          <option value="">
            Select property type
          </option>

          {categories
            .filter(
              (category) =>
                category.status !== "inactive"
            )
            .map((category) => (
              <option
                key={category._id}
                value={category.name}
              >
                {category.name}
              </option>
            ))}

          {!categories.length && (
            <>
              <option value="Villa">
                Villa
              </option>

              <option value="Apartment">
                Apartment
              </option>

              <option value="Bungalow">
                Bungalow
              </option>

              <option value="Land">
                Land
              </option>
            </>
          )}
        </select>
      </div>
    );
  }

  // =======================================================
  // STATUS
  // =======================================================

  if (field.key === "status") {
    return (
      <div className="dj-field">
        <span>{field.label}</span>

        <select
          value={
            value ??
            field.options?.[0] ??
            ""
          }
          onChange={(event) =>
            onChange(event.target.value)
          }
        >
          {(
            field.options ?? [
              "active",
              "inactive",
              "new",
              "pending",
              "contacted",
              "qualified",
              "in_progress",
              "converted",
              "closed",
              "published",
              "draft",
              "archived",
              "scheduled",
              "completed",
              "cancelled",
              "paid",
              "failed",
              "refunded",
            ]
          ).map((option: string) => (
            <option
              key={option}
              value={option}
            >
              {pretty(option)}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // =======================================================
  // COURSE LEVEL
  // =======================================================

  if (field.key === "level") {
    return (
      <div className="dj-field">
        <span>{field.label}</span>

        <select
          value={value ?? "Beginner"}
          onChange={(event) =>
            onChange(event.target.value)
          }
        >
          <option value="Beginner">
            Beginner
          </option>

          <option value="Intermediate">
            Intermediate
          </option>

          <option value="Advanced">
            Advanced
          </option>
        </select>
      </div>
    );
  }

  // =======================================================
  // PRIORITY
  // =======================================================

  if (field.key === "priority") {
    return (
      <div className="dj-field">
        <span>{field.label}</span>

        <select
          value={value ?? "normal"}
          onChange={(event) =>
            onChange(event.target.value)
          }
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
    );
  }

  // =======================================================
  // NUMBERS
  // =======================================================

  if (
    field.key === "price" ||
    field.key === "amount" ||
    [
      "beds",
      "baths",
      "area",
      "floor",
      "totalFloors",
      "floorPlanPrice",
      "sortOrder",
    ].includes(field.key)
  ) {
    return (
      <div className="dj-field">
        <span>{field.label}</span>

        <input
          type="number"
          min="0"
          value={value ?? 0}
          onChange={(event) =>
            onChange(
              Number(event.target.value)
            )
          }
        />
      </div>
    );
  }

  // =======================================================
  // DATE / TIME
  // =======================================================

  if (
    field.key === "preferredDate" ||
    field.key === "date" ||
    field.key === "followUpAt"
  ) {
    return (
      <div className="dj-field">
        <span>{field.label}</span>

        <input
          type="datetime-local"
          value={
            value
              ? new Date(Number(value))
                  .toISOString()
                  .slice(0, 16)
              : ""
          }
          onChange={(event) =>
            onChange(
              event.target.value
                ? new Date(
                    event.target.value
                  ).getTime()
                : undefined
            )
          }
        />
      </div>
    );
  }

  // =======================================================
  // COURSE MATERIAL FILE UPLOAD
  // =======================================================

  if (
    table === "courseMaterials" &&
    field.key === "materialFile"
  ) {
    return (
      <div className="dj-field full">
        <span>{field.label}</span>

        <input
          type="file"
          accept="video/*,application/pdf,audio/*,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"
          onChange={(event) =>
            onChange(
              event.target.files?.[0] ??
                undefined
            )
          }
        />

        <small className="dj-help">
          Upload a recorded class, PDF,
          notes, audio or another course
          resource.
        </small>
      </div>
    );
  }

  // =======================================================
  // PHOTO UPLOAD
  // =======================================================

  if (field.key === "photoFiles") {
    return (
      <div className="dj-field full">
        <span>{field.label}</span>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(event) =>
            onChange(
              Array.from(
                event.target.files ?? []
              )
            )
          }
        />

        <small className="dj-help">
          Select multiple JPG, PNG or WebP
          photos. They will be stored in
          Convex Storage.
        </small>
      </div>
    );
  }

  // =======================================================
  // TEXT LISTS
  // =======================================================

  if (
    field.key.endsWith("Text") ||
    field.key === "imagesText"
  ) {
    return (
      <div className="dj-field full">
        <span>{field.label}</span>

        <textarea
          rows={
            field.key === "imagesText"
              ? 5
              : 6
          }
          value={value ?? ""}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={
            field.placeholder ??
            "One item per line"
          }
        />
      </div>
    );
  }

  // =======================================================
  // GENERIC SELECT
  // =======================================================

  if (
    field.options &&
    Array.isArray(field.options)
  ) {
    return (
      <div className="dj-field">
        <span>{field.label}</span>

        <select
          required={field.required}
          value={value ?? ""}
          onChange={(event) =>
            onChange(event.target.value)
          }
        >
          <option value="">
            Select
          </option>

          {field.options.map(
            (option: string) => (
              <option
                key={option}
                value={option}
              >
                {pretty(option)}
              </option>
            )
          )}
        </select>
      </div>
    );
  }

  // =======================================================
  // NORMAL INPUT
  // =======================================================

  return (
    <div
      className={`dj-field ${
        field.full ? "full" : ""
      }`}
    >
      <span>{field.label}</span>

      <input
        type={
          field.key === "email"
            ? "email"
            : "text"
        }
        required={field.required}
        value={value ?? ""}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={
          field.placeholder
        }
      />
    </div>
  );
}

// =========================================================
// MODAL
// =========================================================

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="dj-modal-backdrop">

      <div className="dj-modal">

        <div className="dj-modal-head">

          <h2>
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
          >
            <X size={19} />
          </button>

        </div>

        {children}

      </div>

    </div>
  );
}

// =========================================================
// INITIAL FORM
// =========================================================

function makeInitial(
  table: TableName,
  existing: any,
  categories: any[],
) {
  const base =
    existing
      ? { ...existing }
      : {};

  // =======================================================
  // PROPERTIES
  // =======================================================

  if (
    table ===
    "properties"
  ) {

    const property = {

      title: "",
      slug: "",
      location: "",
      price: 0,

      type:
        categories[0]?.name ??
        "",

      beds: 0,
      baths: 0,
      area: 0,

      status:
        "draft",

      propertyId: "",

      verification:
        "Verified",

      floor: 0,
      totalFloors: 0,

      parking: "",
      furnishing: "",
      age: "",
      possession: "",

      image: "",
      images: [],

      photoFiles: [],

      videoUrl: "",
      brochureUrl: "",

      overview: "",

      highlights: [],
      keyFeatures: [],
      amenities: [],

      floorPlanTitle: "",
      floorPlanArea: "",
      floorPlanPrice: 0,
      floorPlanImage: "",

      nearbyPlaces: [],

      vastuTitle:
        "DIVYAJYOTI VASTU",

      vastuDescription: "",

      walkthroughTitle:
        "Property walkthrough",

      walkthroughDescription:
        "Property photos and video walkthrough.",

      contactHeading:
        "Let's arrange a conversation.",

      contactDescription:
        "Speak with the Divyajyoti property team.",

      ...base,

    };

    return {

      ...property,

      imagesText:
        (
          property.images ??
          []
        ).join("\n"),

      highlightsText:
        (
          property.highlights ??
          []
        ).join("\n"),

      keyFeaturesText:
        (
          property.keyFeatures ??
          []
        ).join("\n"),

      amenitiesText:
        (
          property.amenities ??
          []
        ).join("\n"),

      nearbyPlacesText:
        (
          property.nearbyPlaces ??
          []
        ).join("\n"),

    };
  }

  // =======================================================
  // COURSES
  // =======================================================

  if (
    table === "courses"
  ) {

    return {

      title: "",
      slug: "",
      category: "",
      duration: "",

      level:
        "Beginner",

      price: 0,

      description: "",

      instructor: "",

      image: "",
      images: [],

      photoFiles: [],

      syllabus: [],

      lessons: [],

      status:
        "draft",

      ...base,

      imagesText:
        (
          base.images ??
          []
        ).join("\n"),

      syllabusText:
        (
          base.syllabus ??
          []
        ).join("\n"),

      lessonsText:
        Array.isArray(
          base.lessons,
        )
          ? base.lessons.join(
              "\n",
            )
          : base.lessons != null
            ? String(
                base.lessons,
              )
            : "",

    };
  }

  // =======================================================
  // COURSE MATERIALS
  // =======================================================

  if (
    table ===
    "courseMaterials"
  ) {

    return {

      courseSlug: "",

      title: "",

      type:
        "VIDEO",

      description: "",

      url: "",

      storageId: "",

      sortOrder: 0,

      status:
        "DRAFT",

      materialFile:
        undefined,

      ...base,

    };
  }

  // =======================================================
  // EVENTS
  // =======================================================

  if (
    table === "events"
  ) {

    return {

      title: "",
      slug: "",

      date:
        Date.now(),

      place: "",

      description: "",

      image: "",
      images: [],

      photoFiles: [],

      status:
        "draft",

      ...base,

      imagesText:
        (
          base.images ??
          []
        ).join("\n"),

    };
  }

  // =======================================================
  // LEADS
  // =======================================================

  if (
    table === "leads"
  ) {

    return {

      name: "",
      phone: "",
      email: "",

      source:
        "website",

      message: "",

      status:
        "new",

      interest: "",
      assignedTo: "",

      priority:
        "normal",

      followUpAt:
        undefined,

      lastContactedAt:
        undefined,

      notes: "",

      ...base,

    };
  }

  // =======================================================
  // CONSULTATIONS
  // =======================================================

  if (
    table ===
    "consultations"
  ) {

    return {

      name: "",
      phone: "",
      email: "",

      service: "",

      message: "",

      preferredDate:
        undefined,

      preferredTime:
        "",

      /*
       * Consultation status is NOT payment status.
       */
      status:
        "pending",

      notes: "",

      ...base,

    };
  }

  // =======================================================
  // SITE VISITS
  // =======================================================

  if (
    table ===
    "siteVisits"
  ) {

    return {

      propertyId: "",

      name: "",
      phone: "",
      email: "",

      preferredDate:
        Date.now(),

      status:
        "pending",

      notes: "",

      ...base,

    };
  }

  // =======================================================
  // COURSE ENROLLMENTS
  // =======================================================

  if (
    table ===
    "courseEnrollments"
  ) {

    return {

      courseSlug: "",
      courseTitle: "",

      name: "",
      email: "",
      phone: "",

      amount: 0,

      currency:
        "INR",

      paymentReference:
        "",

      paymentProofUrl:
        "",

      adminNote:
        "",

      razorpayOrderId:
        "",

      razorpayPaymentId:
        "",

      /*
       * IMPORTANT:
       *
       * New course-payment flow uses:
       * PENDING
       * APPROVED
       * REJECTED
       *
       * Do not use:
       * paid / failed / cancelled
       * here.
       */
      status:
        "PENDING",

      ...base,

    };
  }

  // =======================================================
  // PAYMENTS
  // =======================================================

  return {

    courseSlug: "",
    courseTitle: "",

    name: "",
    email: "",
    phone: "",

    amount: 0,

    paymentId: "",

    razorpayOrderId:
      "",

    razorpayPaymentId:
      "",

    /*
     * This is the separate Payments table.
     * It keeps the payment gateway-style
     * status values.
     */
    status:
      "pending",

    ...base,

  };
}

// =========================================================
// CLEAN FORM
// =========================================================

function cleanForm(
  table: TableName,
  form: any,
) {
  const data = {
    ...form,
  };

  delete data._id;
  delete data._creationTime;
  delete data.photoFiles;
  delete data.materialFile;

  // =======================================================
  // COURSES
  // =======================================================

  if (
    table === "courses"
  ) {

    data.lessons =
      String(
        form.lessonsText ??
          "",
      )
        .split("\n")
        .map(
          (value: string) =>
            Number(
              value.trim(),
            ),
        )
        .filter(
          (value: number) =>
            Number.isFinite(
              value,
            ),
        );

    data.syllabus =
      String(
        form.syllabusText ??
          "",
      )
        .split("\n")
        .map(
          (value: string) =>
            value.trim(),
        )
        .filter(Boolean);

    delete data.lessonsText;
    delete data.syllabusText;
  }

  // =======================================================
  // PROPERTIES
  // =======================================================

  if (
    table ===
    "properties"
  ) {

    data.highlights =
      String(
        form.highlightsText ??
          "",
      )
        .split("\n")
        .map(
          (value: string) =>
            value.trim(),
        )
        .filter(Boolean);

    data.keyFeatures =
      String(
        form.keyFeaturesText ??
          "",
      )
        .split("\n")
        .map(
          (value: string) =>
            value.trim(),
        )
        .filter(Boolean);

    data.amenities =
      String(
        form.amenitiesText ??
          "",
      )
        .split("\n")
        .map(
          (value: string) =>
            value.trim(),
        )
        .filter(Boolean);

    data.nearbyPlaces =
      String(
        form.nearbyPlacesText ??
          "",
      )
        .split("\n")
        .map(
          (value: string) =>
            value.trim(),
        )
        .filter(Boolean);

    delete data.highlightsText;
    delete data.keyFeaturesText;
    delete data.amenitiesText;
    delete data.nearbyPlacesText;
  }

  // =======================================================
  // IMAGES
  // =======================================================

  if (
    table ===
      "properties" ||
    table ===
      "courses" ||
    table ===
      "events"
  ) {

    data.images =
      String(
        form.imagesText ??
          "",
      )
        .split("\n")
        .map(
          (value: string) =>
            value.trim(),
        )
        .filter(Boolean);

    delete data.imagesText;
  }

  // =======================================================
  // SLUG
  // =======================================================

  if (
    table ===
      "properties" ||
    table ===
      "courses" ||
    table ===
      "events"
  ) {

    data.slug =
      slugify(
        String(
          data.slug ||
            data.title,
        ),
      );
  }

  return data;
}

// =========================================================
// EDITOR FIELDS
// =========================================================

function editorFields(
  table: TableName,
) {
  const f = (
    key: string,
    label: string,
    options: any = {},
  ) => ({
    key,
    label,
    ...options,
  });

  switch (table) {

    // =====================================================
    // PROPERTY
    // =====================================================

    case "properties":

      return [

        f(
          "title",
          "Property title",
          {
            required: true,
          },
        ),

        f(
          "slug",
          "Slug",
        ),

        f(
          "type",
          "Property category",
          {
            required: true,
          },
        ),

        f(
          "location",
          "Location",
          {
            required: true,
          },
        ),

        f(
          "price",
          "Price (INR)",
        ),

        f(
          "beds",
          "Bedrooms",
        ),

        f(
          "baths",
          "Bathrooms",
        ),

        f(
          "area",
          "Area / sq.ft.",
        ),

        f(
          "status",
          "Availability status",
          {
            options: [
              "draft",
              "published",
              "active",
              "sold",
              "reserved",
              "archived",
            ],
          },
        ),

        f(
          "propertyId",
          "Property ID",
        ),

        f(
          "verification",
          "Verification",
        ),

        f(
          "floor",
          "Floor",
        ),

        f(
          "totalFloors",
          "Total floors",
        ),

        f(
          "parking",
          "Parking",
        ),

        f(
          "furnishing",
          "Furnishing",
        ),

        f(
          "age",
          "Property age",
        ),

        f(
          "possession",
          "Possession",
        ),

        f(
          "image",
          "Main image URL",
          {
            full: true,
          },
        ),

        f(
          "imagesText",
          "Gallery image URLs",
          {
            full: true,
            placeholder:
              "One image URL per line",
          },
        ),

        f(
          "photoFiles",
          "Upload photos",
          {
            full: true,
          },
        ),

        f(
          "videoUrl",
          "Walkthrough video URL",
          {
            full: true,
          },
        ),

        f(
          "brochureUrl",
          "Brochure URL",
          {
            full: true,
          },
        ),

        f(
          "overview",
          "Property overview",
          {
            full: true,
          },
        ),

        f(
          "highlightsText",
          "Highlights",
          {
            full: true,
            placeholder:
              "One highlight per line",
          },
        ),

        f(
          "keyFeaturesText",
          "Key features",
          {
            full: true,
            placeholder:
              "One feature per line",
          },
        ),

        f(
          "amenitiesText",
          "Amenities",
          {
            full: true,
            placeholder:
              "One amenity per line",
          },
        ),

        f(
          "floorPlanTitle",
          "Floor plan title",
        ),

        f(
          "floorPlanArea",
          "Floor plan area",
        ),

        f(
          "floorPlanPrice",
          "Floor plan price",
        ),

        f(
          "floorPlanImage",
          "Floor plan image URL",
        ),

        f(
          "nearbyPlacesText",
          "Nearby places",
          {
            full: true,
            placeholder:
              "One location per line",
          },
        ),

        f(
          "vastuTitle",
          "Vastu section title",
        ),

        f(
          "vastuDescription",
          "Vastu description",
          {
            full: true,
          },
        ),

        f(
          "walkthroughTitle",
          "Walkthrough title",
        ),

        f(
          "walkthroughDescription",
          "Walkthrough description",
          {
            full: true,
          },
        ),

        f(
          "contactHeading",
          "Contact heading",
        ),

        f(
          "contactDescription",
          "Contact description",
          {
            full: true,
          },
        ),

      ];

    // =====================================================
    // COURSES
    // =====================================================

    case "courses":

      return [

        f(
          "title",
          "Course title",
          {
            required: true,
          },
        ),

        f(
          "slug",
          "Slug",
          {
            required: true,
          },
        ),

        f(
          "category",
          "Category",
          {
            placeholder:
              "Astrology or Real Estate",
          },
        ),

        f(
          "duration",
          "Duration",
        ),

        f(
          "level",
          "Level",
        ),

        f(
          "price",
          "Price (INR)",
        ),

        f(
          "instructor",
          "Instructor",
        ),

        f(
          "status",
          "Status",
          {
            options: [
              "draft",
              "published",
              "archived",
            ],
          },
        ),

        f(
          "image",
          "Cover image URL",
          {
            full: true,
          },
        ),

        f(
          "imagesText",
          "Course gallery",
          {
            full: true,
          },
        ),

        f(
          "photoFiles",
          "Upload course photos",
          {
            full: true,
          },
        ),

        f(
          "description",
          "Description",
          {
            full: true,
          },
        ),

        f(
          "syllabusText",
          "Curriculum",
          {
            full: true,
            placeholder:
              "One lesson title per line",
          },
        ),

        f(
          "lessonsText",
          "Legacy numeric lessons",
          {
            full: true,
            placeholder:
              "Example:\n1\n2\n3\n4",
          },
        ),

      ];

    // =====================================================
    // COURSE MATERIALS
    // =====================================================

    case "courseMaterials":

      return [

        f(
          "courseSlug",
          "Course slug",
          {
            required: true,
            placeholder:
              "Example: predictive-astrology",
          },
        ),

        f(
          "title",
          "Material title",
          {
            required: true,
            placeholder:
              "Example: Predictive Astrology Class 01",
          },
        ),

        f(
          "type",
          "Material type",
          {
            options: [
              "RECORDED_CLASS",
              "PDF",
              "NOTE",
              "LIVE_CLASS",
              "GOOGLE_MEET",
              "VIDEO_LINK",
              "LINK",
              "RESOURCE",
            ],
          },
        ),

        f(
          "description",
          "Description",
          {
            full: true,
            placeholder:
              "Explain what this class, PDF or resource contains.",
          },
        ),

        f(
          "materialFile",
          "Upload material",
          {
            full: true,
          },
        ),

        f(
          "url",
          "External URL / Google Meet link",
          {
            full: true,
            placeholder:
              "Use this for Google Meet, YouTube, Drive or another external resource.",
          },
        ),

        f(
          "sortOrder",
          "Display order",
        ),

        f(
          "status",
          "Publishing status",
          {
            options: [
              "DRAFT",
              "PUBLISHED",
            ],
          },
        ),

      ];

    // =====================================================
    // EVENTS
    // =====================================================

    case "events":

      return [

        f(
          "title",
          "Event title",
          {
            required: true,
          },
        ),

        f(
          "slug",
          "Slug",
          {
            required: true,
          },
        ),

        f(
          "date",
          "Date & time",
        ),

        f(
          "place",
          "Place",
        ),

        f(
          "status",
          "Status",
          {
            options: [
              "draft",
              "published",
              "scheduled",
              "cancelled",
              "completed",
            ],
          },
        ),

        f(
          "image",
          "Cover image URL",
          {
            full: true,
          },
        ),

        f(
          "imagesText",
          "Event gallery",
          {
            full: true,
          },
        ),

        f(
          "photoFiles",
          "Upload event photos",
          {
            full: true,
          },
        ),

        f(
          "description",
          "Description",
          {
            full: true,
          },
        ),

      ];

    // =====================================================
    // LEADS
    // =====================================================

    case "leads":

      return [

        f(
          "name",
          "Name",
          {
            required: true,
          },
        ),

        f(
          "phone",
          "Phone",
          {
            required: true,
          },
        ),

        f(
          "email",
          "Email",
        ),

        f(
          "source",
          "Lead source",
        ),

        f(
          "interest",
          "Interested in",
          {
            placeholder:
              "Property / Astrology / Course / Consultation",
          },
        ),

        f(
          "assignedTo",
          "Assigned to",
        ),

        f(
          "priority",
          "Priority",
        ),

        f(
          "status",
          "Lead status",
          {
            options: [
              "new",
              "contacted",
              "follow_up",
              "qualified",
              "in_progress",
              "converted",
              "closed",
            ],
          },
        ),

        f(
          "followUpAt",
          "Follow-up date",
        ),

        f(
          "message",
          "Message",
          {
            full: true,
          },
        ),

        f(
          "notes",
          "CRM notes",
          {
            full: true,
          },
        ),

      ];

    // =====================================================
    // CONSULTATIONS
    // =====================================================

    case "consultations":

      return [

        f(
          "name",
          "Name",
          {
            required: true,
          },
        ),

        f(
          "phone",
          "Phone",
          {
            required: true,
          },
        ),

        f(
          "email",
          "Email",
        ),

        f(
          "service",
          "Service",
          {
            required: true,
          },
        ),

        f(
          "preferredDate",
          "Preferred date",
        ),

        f(
          "preferredTime",
          "Preferred time",
        ),

        f(
          "status",
          "Status",
          {
            options: [
              "pending",
              "contacted",
              "scheduled",
              "completed",
              "cancelled",
            ],
          },
        ),

        f(
          "message",
          "Message",
          {
            full: true,
          },
        ),

        f(
          "notes",
          "Internal notes",
          {
            full: true,
          },
        ),

      ];

    // =====================================================
    // SITE VISITS
    // =====================================================

    case "siteVisits":

      return [

        f(
          "propertyId",
          "Property ID",
          {
            required: true,
          },
        ),

        f(
          "name",
          "Customer name",
          {
            required: true,
          },
        ),

        f(
          "phone",
          "Phone",
          {
            required: true,
          },
        ),

        f(
          "email",
          "Email",
        ),

        f(
          "preferredDate",
          "Preferred date",
        ),

        f(
          "status",
          "Status",
          {
            options: [
              "pending",
              "scheduled",
              "completed",
              "cancelled",
            ],
          },
        ),

        f(
          "notes",
          "Notes",
          {
            full: true,
          },
        ),

      ];

    // =====================================================
    // COURSE ENROLLMENTS
    // =====================================================

    case "courseEnrollments":

      return [

        f(
          "courseSlug",
          "Course slug",
          {
            required: true,
          },
        ),

        f(
          "courseTitle",
          "Course title",
          {
            required: true,
          },
        ),

        f(
          "name",
          "Student name",
          {
            required: true,
          },
        ),

        f(
          "email",
          "Email",
          {
            required: true,
          },
        ),

        f(
          "phone",
          "Phone",
        ),

        f(
          "amount",
          "Amount",
        ),

        f(
          "currency",
          "Currency",
        ),

        f(
          "paymentReference",
          "Payment UTR / Reference",
        ),

        f(
          "paymentProofUrl",
          "Payment proof URL",
          {
            full: true,
          },
        ),

        f(
          "adminNote",
          "Admin note",
          {
            full: true,
          },
        ),

        f(
          "razorpayOrderId",
          "Razorpay order ID",
        ),

        f(
          "razorpayPaymentId",
          "Razorpay payment ID",
        ),

        /*
         * COURSE ENROLLMENT STATUS
         *
         * PENDING  -> payment submitted
         * APPROVED -> admin verified payment
         * REJECTED -> admin rejected payment
         */

        f(
          "status",
          "Payment status",
          {
            options: [
              "PENDING",
              "APPROVED",
              "REJECTED",
            ],
          },
        ),

      ];

    // =====================================================
    // PAYMENTS
    // =====================================================

    case "payments":

      return [

        f(
          "courseSlug",
          "Course slug",
        ),

        f(
          "courseTitle",
          "Course title",
        ),

        f(
          "name",
          "Customer name",
          {
            required: true,
          },
        ),

        f(
          "email",
          "Email",
          {
            required: true,
          },
        ),

        f(
          "phone",
          "Phone",
        ),

        f(
          "amount",
          "Amount",
        ),

        f(
          "paymentId",
          "Payment ID",
        ),

        f(
          "razorpayOrderId",
          "Razorpay order ID",
        ),

        f(
          "razorpayPaymentId",
          "Razorpay payment ID",
        ),

        /*
         * Separate Payments table.
         */

        f(
          "status",
          "Payment status",
          {
            options: [
              "pending",
              "paid",
              "failed",
              "refunded",
              "cancelled",
            ],
          },
        ),

      ];

    // =====================================================
    // PROPERTY CATEGORIES
    // =====================================================

    case "propertyCategories":
      return [];
  }
}