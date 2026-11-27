// EDIT: your name, spelled exactly as it appears in publications.json
const OWNER_NAME = "Yuri Lee";

// Where the data lives, and the order link buttons appear in.
const DATA_URL = "publications/publications.json";
const LINK_ORDER = ["Paper", "Website", "Code", "Data"];
const PROJECTS_URL = "projects/projects.json";
const PROJECT_LINK_ORDER = ["Website", "Code", "Demo", "Paper", "Slides"];

// ---------- Shared helpers ----------

// Create an element with an optional class and text.
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

// Link buttons in the given order (labels not in `order` go last).
// Returns null when there are no links.
function renderLinks(links, order) {
  links = links || {};
  const labels = [
    ...order.filter((label) => links[label]),
    ...Object.keys(links).filter((label) => !order.includes(label) && links[label]),
  ];
  if (!labels.length) return null;

  const group = el("span", "pub-links");
  labels.forEach((label) => {
    const a = el("a", "", label);
    a.href = links[label];
    group.append(a);
  });
  return group;
}

async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

// ---------- Research ----------

// "Jane Doe*" -> name "Jane Doe" plus a superscript * (equal contribution).
function renderAuthors(authors) {
  const line = el("div", "pub-authors");
  authors.forEach((raw, i) => {
    if (i > 0) line.append(", ");
    const starred = raw.trim().endsWith("*");
    const name = raw.trim().replace(/\*$/, "").trim();
    line.append(name === OWNER_NAME ? el("span", "me", name) : name);
    if (starred) line.append(el("sup", "", "*"));
  });
  return line;
}

// Venue text, then link buttons, then the optional grey note.
function renderMeta(pub) {
  const line = el("div", "pub-meta");
  line.append(el("span", "pub-venue", pub.venue));

  const links = renderLinks(pub.links, LINK_ORDER);
  if (links) line.append(links);

  if (pub.note) line.append(el("span", "pub-note", pub.note));
  return line;
}

function renderPublication(pub) {
  const item = el("li", "pub");
  item.append(
    el("div", "pub-title", pub.title),
    renderAuthors(pub.authors || []),
    renderMeta(pub)
  );
  return item;
}

async function loadPublications() {
  const list = document.getElementById("publications");
  try {
    const pubs = await fetchJSON(DATA_URL);
    list.replaceChildren(...pubs.map(renderPublication));
  } catch (error) {
    console.error("Could not load publications:", error);
    list.replaceChildren(
      el(
        "li",
        "notice",
        "Could not load the publication list. If you opened this file directly, " +
          "preview it with a local server instead (see README.md). Otherwise, " +
          "check publications/publications.json for a typo."
      )
    );
  }
}

// ---------- Projects ----------

function renderProject(project) {
  const item = el("li", "pub project");
  const links = project.links || {};

  // Optional thumbnail on the left; dropped if the image file is missing.
  if (project.thumbnail) {
    const img = el("img", "project-thumb");
    img.src = project.thumbnail;
    img.alt = "";
    img.addEventListener("error", () => img.remove());
    item.append(img);
  }

  const body = el("div", "project-body");

  // Line 1: title (a link when the project has a Website).
  const title = el("div", "pub-title");
  if (links.Website) {
    const a = el("a", "", project.title);
    a.href = links.Website;
    title.append(a);
  } else {
    title.textContent = project.title;
  }
  body.append(title);

  if (project.collaborators && project.collaborators.length) {
    body.append(el("div", "project-collaborators", "with " + project.collaborators.join(", ")));
  }

  // Line 2: role · affiliation · period (missing parts are skipped).
  const info = [project.role, project.affiliation, project.period].filter(Boolean).join(" · ");
  if (info) body.append(el("div", "project-info", info));

  // Line 3: description. The one field inserted as HTML, so it can hold <a> links.
  if (project.description) {
    const description = el("div", "project-description");
    description.innerHTML = project.description;
    body.append(description);
  }

  // Line 4: link buttons, then tags in small grey text.
  const linkGroup = renderLinks(links, PROJECT_LINK_ORDER);
  const tags = (project.tags || []).join(" · ");
  if (linkGroup || tags) {
    const meta = el("div", "project-meta");
    if (linkGroup) meta.append(linkGroup);
    if (tags) meta.append(el("span", "project-tags", tags));
    body.append(meta);
  }

  item.append(body);
  return item;
}

// The Projects section starts hidden and is only shown once there is
// something to list, so a missing or empty projects.json leaves no heading.
async function loadProjects() {
  try {
    const projects = await fetchJSON(PROJECTS_URL);
    if (!Array.isArray(projects) || !projects.length) return;
    document.getElementById("project-list").replaceChildren(...projects.map(renderProject));
    document.getElementById("projects").hidden = false;
  } catch (error) {
    console.warn("Projects section hidden; could not load projects:", error);
  }
}

loadPublications();
loadProjects();
