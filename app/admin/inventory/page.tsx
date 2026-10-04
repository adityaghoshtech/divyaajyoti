"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowLeft,
  Check,
  Download,
  Edit3,
  FileText,
  FolderKanban,
  Import,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

import "./inventory.css";

type Project = {
  _id: Id<"propertyProjects">;
  name: string;
  slug: string;
  developer?: string;
  location?: string;
  type: string;
  description?: string;
  status: string;
};

type Row = {
  _id: Id<"propertyInventory">;
  projectId: Id<"propertyProjects">;
  inventoryType: string;
  unitCode: string;
  category?: string;
  tower?: string;
  floor?: number;
  flatNo?: string;
  facing?: string;
  size?: string;
  price?: number;
  parking?: string;
  totalValue?: number;
  status: string;
  clientName?: string;
  sourceDocument?: string;
  notes?: string;
};

type Form = {
  projectId: string;
  inventoryType: "FLAT" | "PLOT";
  unitCode: string;
  category: string;
  tower: string;
  floor: string;
  flatNo: string;
  facing: string;
  size: string;
  price: string;
  parking: string;
  totalValue: string;
  status: "AVAILABLE" | "BOOKED" | "HOLD" | "SOLD" | "BLOCKED";
  clientName: string;
  sourceDocument: string;
  notes: string;
};

const emptyForm: Form = {
  projectId: "",
  inventoryType: "FLAT",
  unitCode: "",
  category: "",
  tower: "",
  floor: "",
  flatNo: "",
  facing: "",
  size: "",
  price: "",
  parking: "",
  totalValue: "",
  status: "AVAILABLE",
  clientName: "",
  sourceDocument: "",
  notes: "",
};

const num = (s: string) => {
  if (!s.trim()) return undefined;
  const n = Number(s.replace(/,/g, ""));
  return Number.isFinite(n) ? n : undefined;
};

const money = (n?: number) =>
  typeof n === "number" ? `₹${n.toLocaleString("en-IN")}` : "—";

const header = (s: string) =>
  s.trim().toLowerCase().replace(/[\s-]+/g, "_");

function csvLine(line: string) {
  const out: string[] = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (quoted && line[i + 1] === '"') {
        value += '"';
        i++;
      } else quoted = !quoted;
    } else if (c === "," && !quoted) {
      out.push(value.trim());
      value = "";
    } else value += c;
  }

  out.push(value.trim());
  return out;
}

function parseCsv(text: string) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = csvLine(lines[0]).map(header);

  return lines.slice(1).map((line) => {
    const values = csvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((key, i) => (row[key] = values[i] ?? ""));
    return row;
  });
}

const value = (r: Record<string, string>, ...keys: string[]) => {
  for (const k of keys) if (r[k] !== undefined) return r[k].trim();
  return "";
};

function csvRow(r: Record<string, string>) {
  return {
    unitCode: value(r, "unit_code", "unit", "flat_no", "plot_no"),
    inventoryType: value(r, "inventory_type", "type") || "FLAT",
    category: value(r, "category", "configuration", "bhk") || undefined,
    tower: value(r, "tower", "tower_no", "block") || undefined,
    floor: num(value(r, "floor", "floor_no")),
    flatNo: value(r, "flat_no", "flat_number") || undefined,
    facing: value(r, "facing", "direction") || undefined,
    size: value(r, "size", "area", "plot_size") || undefined,
    price: num(value(r, "price", "base_price")),
    parking: value(r, "parking") || undefined,
    totalValue: num(value(r, "total_value", "total")),
    status: value(r, "status", "availability") || "AVAILABLE",
    clientName: value(r, "client_name", "client", "allottee") || undefined,
    sourceDocument: value(r, "source_document", "source") || undefined,
    notes: value(r, "notes", "remarks") || undefined,
  };
}

export default function InventoryAdminPage() {
  const projects = useQuery(api.inventory.listProjects, { includeInactive: true });
  const [projectId, setProjectId] = useState("");
  const [status, setStatus] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [search, setSearch] = useState("");
  const [section, setSection] = useState<"inventory" | "projects" | "documents">("inventory");

  const rows = useQuery(api.inventory.listInventory, {
    projectId: projectId ? projectId as Id<"propertyProjects"> : undefined,
    status: status === "ALL" ? undefined : status,
    inventoryType: type === "ALL" ? undefined : type,
    search: search.trim() || undefined,
  });

  const stats = useQuery(api.inventory.stats, {
    projectId: projectId ? projectId as Id<"propertyProjects"> : undefined,
  });

  const documents = useQuery(api.inventory.listDocuments, {
    projectId: projectId ? projectId as Id<"propertyProjects"> : undefined,
  });

  const createProject = useMutation(api.inventory.createProject);
  const updateProject = useMutation(api.inventory.updateProject);
  const removeProject = useMutation(api.inventory.removeProject);
  const createInventory = useMutation(api.inventory.createInventory);
  const updateInventory = useMutation(api.inventory.updateInventory);
  const updateStatus = useMutation(api.inventory.updateStatus);
  const removeInventory = useMutation(api.inventory.removeInventory);
  const bulkUpsert = useMutation(api.inventory.bulkUpsert);
  const generateUploadUrl = useMutation(api.inventory.generateUploadUrl);
  const createDocument = useMutation(api.inventory.createDocument);
  const removeDocument = useMutation(api.inventory.removeDocument);

  const [form, setForm] = useState<Form>(emptyForm);
  const [editing, setEditing] = useState<Row | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [projectForm, setProjectForm] = useState({
    name: "", slug: "", developer: "", location: "",
    type: "MIXED", description: "", status: "ACTIVE",
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);

  const [showImport, setShowImport] = useState(false);
  const [importProject, setImportProject] = useState("");
  const [importRows, setImportRows] = useState<Record<string, string>[]>([]);
  const [importName, setImportName] = useState("");

  const [documentProject, setDocumentProject] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentCategory, setDocumentCategory] = useState("ALLOTMENT");
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const flash = (message: string) => {
    setMessage(message);
    setError("");
  };

  const fail = (err: any) => {
    setError(err?.message || "Something went wrong.");
    setMessage("");
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, projectId: projectId || projects?.[0]?._id || "" });
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const openEdit = (r: Row) => {
    setEditing(r);
    setForm({
      projectId: r.projectId,
      inventoryType: r.inventoryType === "PLOT" ? "PLOT" : "FLAT",
      unitCode: r.unitCode || "",
      category: r.category || "",
      tower: r.tower || "",
      floor: r.floor === undefined ? "" : String(r.floor),
      flatNo: r.flatNo || "",
      facing: r.facing || "",
      size: r.size || "",
      price: r.price === undefined ? "" : String(r.price),
      parking: r.parking || "",
      totalValue: r.totalValue === undefined ? "" : String(r.totalValue),
      status: ["BOOKED", "HOLD", "SOLD", "BLOCKED"].includes(r.status)
        ? r.status as Form["status"] : "AVAILABLE",
      clientName: r.clientName || "",
      sourceDocument: r.sourceDocument || "",
      notes: r.notes || "",
    });
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const saveInventory = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (!form.projectId || !form.unitCode.trim()) {
        throw new Error("Project and unit / plot number are required.");
      }

      const payload = {
        projectId: form.projectId as Id<"propertyProjects">,
        inventoryType: form.inventoryType,
        unitCode: form.unitCode.trim(),
        category: form.category.trim() || undefined,
        tower: form.tower.trim() || undefined,
        floor: num(form.floor),
        flatNo: form.flatNo.trim() || undefined,
        facing: form.facing.trim() || undefined,
        size: form.size.trim() || undefined,
        price: num(form.price),
        parking: form.parking.trim() || undefined,
        totalValue: num(form.totalValue),
        status: form.status,
        clientName: form.clientName.trim() || undefined,
        sourceDocument: form.sourceDocument.trim() || undefined,
        notes: form.notes.trim() || undefined,
      };

      if (editing) await updateInventory({ id: editing._id, ...payload });
      else await createInventory(payload);

      setShowForm(false);
      flash(editing ? "Inventory updated." : "Inventory created.");
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const openProject = (p?: Project) => {
    setEditingProject(p || null);
    setProjectForm({
      name: p?.name || "",
      slug: p?.slug || "",
      developer: p?.developer || "",
      location: p?.location || "",
      type: p?.type || "MIXED",
      description: p?.description || "",
      status: p?.status || "ACTIVE",
    });
    setShowProjectForm(true);
  };

  const saveProject = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);

    try {
      const slug = projectForm.slug.trim() ||
        projectForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      const payload = {
        name: projectForm.name.trim(),
        slug,
        developer: projectForm.developer.trim() || undefined,
        location: projectForm.location.trim() || undefined,
        type: projectForm.type,
        description: projectForm.description.trim() || undefined,
        status: projectForm.status,
      };

      if (!payload.name) throw new Error("Project name is required.");

      if (editingProject) await updateProject({ id: editingProject._id, ...payload });
      else await createProject(payload);

      setShowProjectForm(false);
      flash(editingProject ? "Project updated." : "Project created.");
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const importCsv = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      fail(new Error("Please select a CSV file."));
      return;
    }

    const parsed = parseCsv(await file.text());
    setImportRows(parsed);
    setImportName(file.name);
  };

  const runImport = async () => {
    setBusy(true);
    try {
      if (!importProject) throw new Error("Select a project for this import.");
      if (!importRows.length) throw new Error("Select a CSV file first.");

      const rows = importRows.map(csvRow).filter((r) => r.unitCode.trim());
      if (!rows.length) throw new Error("No unit_code values were found.");

      const result = await bulkUpsert({
        projectId: importProject as Id<"propertyProjects">,
        rows,
      });

      setShowImport(false);
      setImportRows([]);
      setImportName("");
      flash(`${result.created} created, ${result.updated} updated, ${result.skipped} skipped.`);
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const uploadDocument = async () => {
    setBusy(true);
    try {
      if (!documentProject) throw new Error("Select a project.");
      if (!documentFile) throw new Error("Select a document.");

      const uploadUrl = await generateUploadUrl({});
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": documentFile.type || "application/octet-stream" },
        body: documentFile,
      });

      if (!response.ok) throw new Error(`Upload failed: ${documentFile.name}`);

      const result = await response.json();
      if (!result.storageId) throw new Error("Convex did not return a storage ID.");

      await createDocument({
        projectId: documentProject as Id<"propertyProjects">,
        title: documentTitle.trim() || documentFile.name,
        fileName: documentFile.name,
        mimeType: documentFile.type || "application/octet-stream",
        category: documentCategory,
        storageId: result.storageId as Id<"_storage">,
      });

      setDocumentFile(null);
      setDocumentTitle("");
      flash("Document uploaded.");
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const exportCsv = () => {
    const headers = [
      "unit_code","inventory_type","category","tower","floor","flat_no",
      "facing","size","price","parking","total_value","status",
      "client_name","source_document","notes",
    ];

    const q = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

    const csv = [
      headers.join(","),
      ...(rows || []).map((r) => [
        r.unitCode,r.inventoryType,r.category,r.tower,r.floor,r.flatNo,
        r.facing,r.size,r.price,r.parking,r.totalValue,r.status,
        r.clientName,r.sourceDocument,r.notes,
      ].map(q).join(",")),
    ].join("\n");

    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "divyajyoti-inventory.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteRow = async (r: Row) => {
    if (!confirm(`Delete ${r.unitCode}?`)) return;
    try {
      await removeInventory({ id: r._id });
      flash(`${r.unitCode} deleted.`);
    } catch (err) {
      fail(err);
    }
  };

  const deleteProjectRecord = async (p: Project) => {
    if (!confirm(`Delete project "${p.name}"?`)) return;
    try {
      await removeProject({ id: p._id });
      if (projectId === p._id) setProjectId("");
      flash(`${p.name} deleted.`);
    } catch (err) {
      fail(err);
    }
  };

  const deleteDocument = async (id: Id<"propertyDocuments">) => {
    if (!confirm("Delete this document?")) return;
    try {
      await removeDocument({ id });
      flash("Document deleted.");
    } catch (err) {
      fail(err);
    }
  };

  return (
    <main className="dj-inventory-page">
      <div className="dj-inventory-shell">
        <header className="dj-inventory-header">
          <div>
            <a href="/admin" className="dj-inventory-back">
              <ArrowLeft size={15} /> Back to admin
            </a>
            <span className="dj-inventory-kicker">DIVYAJYOTI PROPERTY OPERATIONS</span>
            <h1>Inventory Management</h1>
            <p>
              Manage flats, plots, project documents and allotment status
              from one internal workspace.
            </p>
          </div>

          <div className="dj-inventory-actions">
            <button className="dj-inventory-btn secondary" onClick={exportCsv}>
              <Download size={15} /> Export CSV
            </button>
            <button className="dj-inventory-btn primary" onClick={openCreate}>
              <Plus size={15} /> Add inventory
            </button>
          </div>
        </header>

        {(message || error) && (
          <div className={`dj-inventory-alert ${error ? "error" : "success"}`}>
            {error || message}
          </div>
        )}

        <nav className="dj-inventory-tabs">
          {(["inventory", "projects", "documents"] as const).map((item) => (
            <button
              key={item}
              className={section === item ? "active" : ""}
              onClick={() => setSection(item)}
            >
              {item === "inventory" ? "Inventory" :
               item === "projects" ? "Projects" : "Documents"}
            </button>
          ))}
        </nav>

        {section === "inventory" && (
          <>
            <section className="dj-inventory-stats">
              {[
                ["Total", stats?.total],
                ["Available", stats?.available],
                ["Booked", stats?.booked],
                ["Hold", stats?.hold],
                ["Flats", stats?.flats],
                ["Plots", stats?.plots],
              ].map(([label, count]) => (
                <div className="dj-stat" key={label as string}>
                  <span>{label}</span>
                  <strong>{count ?? "—"}</strong>
                </div>
              ))}
            </section>

            <section className="dj-inventory-toolbar">
              <div className="dj-search">
                <Search size={15} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search unit, tower, client, facing..."
                />
              </div>

              <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                <option value="">All projects</option>
                {projects?.map((p) => (
                  <option value={p._id} key={p._id}>{p.name}</option>
                ))}
              </select>

              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="ALL">All types</option>
                <option value="FLAT">Flats</option>
                <option value="PLOT">Plots</option>
              </select>

              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="ALL">All status</option>
                <option value="AVAILABLE">Available</option>
                <option value="BOOKED">Booked</option>
                <option value="HOLD">Hold</option>
                <option value="SOLD">Sold</option>
                <option value="BLOCKED">Blocked</option>
              </select>

              <button
                className="dj-icon-btn"
                onClick={() => setSearch((s) => s)}
                title="Refresh"
              >
                <RefreshIcon />
              </button>
            </section>

            <section className="dj-inventory-card">
              <div className="dj-card-head">
                <div>
                  <strong>{projects?.find((p) => p._id === projectId)?.name || "All projects"}</strong>
                  <small>{rows?.length ?? 0} records</small>
                </div>

                <button className="dj-inventory-btn secondary" onClick={() => setShowImport(true)}>
                  <Import size={15} /> Bulk import CSV
                </button>
              </div>

              <div className="dj-table-wrap">
                <table className="dj-inventory-table">
                  <thead>
                    <tr>
                      <th>Unit</th><th>Type</th><th>Category</th>
                      <th>Location</th><th>Facing</th><th>Size</th>
                      <th>Price</th><th>Status</th><th>Client</th><th />
                    </tr>
                  </thead>
                  <tbody>
                    {rows?.map((r) => (
                      <tr key={r._id}>
                        <td><strong>{r.unitCode}</strong><small>{r.sourceDocument || ""}</small></td>
                        <td><span className="dj-pill">{r.inventoryType}</span></td>
                        <td>{r.category || "—"}</td>
                        <td><strong>{r.tower || "—"}</strong><small>{r.floor !== undefined ? `Floor ${r.floor}` : r.flatNo || ""}</small></td>
                        <td>{r.facing || "—"}</td>
                        <td>{r.size || "—"}</td>
                        <td>{money(r.price)}</td>
                        <td>
                          <select
                            className={`dj-status ${r.status.toLowerCase()}`}
                            value={r.status}
                            onChange={async (e) => {
                              try {
                                await updateStatus({ id: r._id, status: e.target.value });
                                flash(`${r.unitCode} status updated.`);
                              } catch (err) { fail(err); }
                            }}
                          >
                            {["AVAILABLE","BOOKED","HOLD","SOLD","BLOCKED"].map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td>{r.clientName || "—"}</td>
                        <td>
                          <div className="dj-row-actions">
                            <button onClick={() => openEdit(r)} title="Edit"><Edit3 size={14} /></button>
                            <button onClick={() => deleteRow(r)} title="Delete"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {!rows?.length && (
                      <tr>
                        <td colSpan={10} className="dj-empty">
                          <FolderKanban size={27} />
                          <strong>No inventory records found.</strong>
                          <span>Create a unit or import the project CSV.</span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {section === "projects" && (
          <section className="dj-panel">
            <div className="dj-panel-head">
              <div>
                <span className="dj-inventory-kicker">PROJECT MASTER</span>
                <h2>Property projects</h2>
                <p>Create one project for each development, plot scheme or inventory source.</p>
              </div>
              <button className="dj-inventory-btn primary" onClick={() => openProject()}>
                <Plus size={15} /> Add project
              </button>
            </div>

            <div className="dj-project-grid">
              {projects?.map((p) => (
                <article className="dj-project-card" key={p._id}>
                  <div className="dj-project-top">
                    <span>{p.type}</span>
                    <span>{p.status}</span>
                  </div>
                  <h3>{p.name}</h3>
                  <p>{p.location || "Location not added"}</p>
                  <small>{p.developer || "Developer not added"}</small>
                  <div className="dj-project-actions">
                    <button onClick={() => openProject(p)}><Edit3 size={13} /> Edit</button>
                    <button onClick={() => deleteProjectRecord(p)}><Trash2 size={13} /> Delete</button>
                  </div>
                </article>
              ))}
              {!projects?.length && <div className="dj-empty large">No projects yet.</div>}
            </div>
          </section>
        )}

        {section === "documents" && (
          <section className="dj-panel">
            <div className="dj-panel-head">
              <div>
                <span className="dj-inventory-kicker">PROJECT DOCUMENTS</span>
                <h2>Allotment sheets & documents</h2>
                <p>Keep the original PDFs, maps and price sheets attached to each project.</p>
              </div>
            </div>

            <div className="dj-document-upload">
              <select value={documentProject} onChange={(e) => setDocumentProject(e.target.value)}>
                <option value="">Select project</option>
                {projects?.map((p) => <option value={p._id} key={p._id}>{p.name}</option>)}
              </select>

              <input value={documentTitle} onChange={(e) => setDocumentTitle(e.target.value)} placeholder="Document title" />

              <select value={documentCategory} onChange={(e) => setDocumentCategory(e.target.value)}>
                <option>ALLOTMENT</option><option>MAP</option><option>PRICE</option><option>BROCHURE</option><option>OTHER</option>
              </select>

              <label className="dj-file">
                <Upload size={15} />
                <span>{documentFile?.name || "Choose file"}</span>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.xlsx,.xls,.doc,.docx"
                  onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                />
              </label>

              <button className="dj-inventory-btn primary" disabled={busy} onClick={uploadDocument}>
                <Upload size={15} /> Upload
              </button>
            </div>

            <div className="dj-document-grid">
              {documents?.map((d) => (
                <article className="dj-document" key={d._id}>
                  <div className="dj-document-icon"><FileText size={20} /></div>
                  <div>
                    <strong>{d.title}</strong>
                    <span>{d.fileName}</span>
                    <small>{d.category}</small>
                  </div>
                  <div className="dj-document-actions">
                    {d.fileUrl && <a href={d.fileUrl} target="_blank" rel="noreferrer">View</a>}
                    <button onClick={() => deleteDocument(d._id)}><Trash2 size={14} /></button>
                  </div>
                </article>
              ))}
              {!documents?.length && <div className="dj-empty large">No documents found.</div>}
            </div>
          </section>
        )}
      </div>

      {showForm && (
        <Modal title={editing ? "Edit inventory" : "Add inventory"} close={() => setShowForm(false)}>
          <form className="dj-form" onSubmit={saveInventory}>
            <label>Project
              <select value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} required>
                <option value="">Select project</option>
                {projects?.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </label>

            <div className="dj-form-grid two">
              <label>Type<select value={form.inventoryType} onChange={(e) => setForm({ ...form, inventoryType: e.target.value as "FLAT" | "PLOT" })}><option>FLAT</option><option>PLOT</option></select></label>
              <label>Unit / plot number<input value={form.unitCode} onChange={(e) => setForm({ ...form, unitCode: e.target.value })} placeholder="AC-1D-4A / DK-U-10" required /></label>
            </div>

            <div className="dj-form-grid three">
              <label>Category<input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="1 BHK / 2 Katha" /></label>
              <label>Tower / block<input value={form.tower} onChange={(e) => setForm({ ...form, tower: e.target.value })} /></label>
              <label>Floor<input type="number" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} /></label>
            </div>

            <div className="dj-form-grid three">
              <label>Flat no.<input value={form.flatNo} onChange={(e) => setForm({ ...form, flatNo: e.target.value })} /></label>
              <label>Facing<input value={form.facing} onChange={(e) => setForm({ ...form, facing: e.target.value })} /></label>
              <label>Size<input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="850 sq.ft. / 1.5 Katha" /></label>
            </div>

            <div className="dj-form-grid three">
              <label>Price<input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
              <label>Parking<input value={form.parking} onChange={(e) => setForm({ ...form, parking: e.target.value })} /></label>
              <label>Total value<input value={form.totalValue} onChange={(e) => setForm({ ...form, totalValue: e.target.value })} /></label>
            </div>

            <div className="dj-form-grid two">
              <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Form["status"] })}>{["AVAILABLE","BOOKED","HOLD","SOLD","BLOCKED"].map((s) => <option key={s}>{s}</option>)}</select></label>
              <label>Client / allottee<input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="Admin-only" /></label>
            </div>

            <div className="dj-form-grid two">
              <label>Source document<input value={form.sourceDocument} onChange={(e) => setForm({ ...form, sourceDocument: e.target.value })} /></label>
              <label>Notes<input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
            </div>

            <div className="dj-modal-actions">
              <button type="button" className="dj-inventory-btn secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="dj-inventory-btn primary" disabled={busy}><Check size={15} /> {busy ? "Saving..." : "Save inventory"}</button>
            </div>
          </form>
        </Modal>
      )}

      {showProjectForm && (
        <Modal title={editingProject ? "Edit project" : "Add project"} close={() => setShowProjectForm(false)}>
          <form className="dj-form" onSubmit={saveProject}>
            <label>Project name<input value={projectForm.name} onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} placeholder="Arbanique Housing" required /></label>
            <div className="dj-form-grid two">
              <label>Slug<input value={projectForm.slug} onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })} /></label>
              <label>Developer<input value={projectForm.developer} onChange={(e) => setProjectForm({ ...projectForm, developer: e.target.value })} /></label>
            </div>
            <div className="dj-form-grid two">
              <label>Location<input value={projectForm.location} onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })} /></label>
              <label>Type<select value={projectForm.type} onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })}><option>MIXED</option><option>FLAT</option><option>PLOT</option></select></label>
            </div>
            <div className="dj-form-grid two">
              <label>Status<select value={projectForm.status} onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}><option>ACTIVE</option><option>INACTIVE</option></select></label>
              <label>Description<input value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} /></label>
            </div>
            <div className="dj-modal-actions">
              <button type="button" className="dj-inventory-btn secondary" onClick={() => setShowProjectForm(false)}>Cancel</button>
              <button className="dj-inventory-btn primary" disabled={busy}><Check size={15} /> Save project</button>
            </div>
          </form>
        </Modal>
      )}

      {showImport && (
        <Modal title="Import inventory CSV" close={() => setShowImport(false)}>
          <div className="dj-import">
            <label>Project
              <select value={importProject} onChange={(e) => setImportProject(e.target.value)}>
                <option value="">Select project</option>
                {projects?.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </label>

            <label className="dj-import-file">
              <Import size={18} />
              <strong>{importName || "Choose CSV file"}</strong>
              <span>Required column: unit_code</span>
              <input type="file" accept=".csv,text/csv" onChange={importCsv} />
            </label>

            {importRows.length > 0 && (
              <div className="dj-import-preview">
                <strong>{importRows.length} rows ready</strong>
                <span>{importRows.slice(0, 5).map((r) => value(r, "unit_code", "unit", "flat_no", "plot_no")).filter(Boolean).join(" • ")}</span>
              </div>
            )}

            <div className="dj-modal-actions">
              <button className="dj-inventory-btn secondary" onClick={() => setShowImport(false)}>Cancel</button>
              <button className="dj-inventory-btn primary" disabled={busy || !importRows.length} onClick={runImport}>
                <Import size={15} /> {busy ? "Importing..." : "Import inventory"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}

function RefreshIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4" />
    </svg>
  );
}

function Modal({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="dj-modal-backdrop">
      <div className="dj-modal">
        <div className="dj-modal-head">
          <h2>{title}</h2>
          <button onClick={close}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
