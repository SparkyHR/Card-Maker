const state = {
  backgroundColor: "#f7f1df",
  accentColor: "#216869",
  borderColor: "#121212",
  frameStyle: "classic",
  borderWidth: 3,
  cornerRadius: 10,
  titleText: "Field Notes",
  subtitleText: "Custom card",
  bodyText: "A compact card template for ideas, games, inventory, gifts, study notes, and small keepsakes.",
  footerText: "No. 001",
  textColor: "#171717",
  titleColor: "#171717",
  subtitleColor: "#216869",
  bodyColor: "#171717",
  footerColor: "#171717",
  fontScale: 100,
  monogramText: "FN",
  shapeStyle: "circle",
  showGrid: false,
  showBleed: true,
  showFooter: true,
  ruleCount: 0,
  template: "classic",
  imageData: "",
  imagePlacement: "mark",
  imageFit: "cover",
  imageOpacity: 100,
  imagePositionX: 50,
  imagePositionY: 50
};

const fields = {
  backgroundColor: document.querySelector("#backgroundColor"),
  borderColor: document.querySelector("#borderColor"),
  frameStyle: document.querySelector("#frameStyle"),
  borderWidth: document.querySelector("#borderWidth"),
  cornerRadius: document.querySelector("#cornerRadius"),
  titleText: document.querySelector("#titleText"),
  subtitleText: document.querySelector("#subtitleText"),
  bodyText: document.querySelector("#bodyText"),
  footerText: document.querySelector("#footerText"),
  textColor: document.querySelector("#textColor"),
  titleColor: document.querySelector("#titleColor"),
  subtitleColor: document.querySelector("#subtitleColor"),
  bodyColor: document.querySelector("#bodyColor"),
  footerColor: document.querySelector("#footerColor"),
  fontScale: document.querySelector("#fontScale"),
  monogramText: document.querySelector("#monogramText"),
  shapeStyle: document.querySelector("#shapeStyle"),
  showGrid: document.querySelector("#showGrid"),
  showBleed: document.querySelector("#showBleed"),
  showFooter: document.querySelector("#showFooter"),
  ruleCount: document.querySelector("#ruleCount"),
  imagePlacement: document.querySelector("#imagePlacement"),
  imageFit: document.querySelector("#imageFit"),
  imageOpacity: document.querySelector("#imageOpacity"),
  imagePositionX: document.querySelector("#imagePositionX"),
  imagePositionY: document.querySelector("#imagePositionY")
};

const preview = document.querySelector("#cardPreview");
const titlePreview = document.querySelector("#titlePreview");
const subtitlePreview = document.querySelector("#subtitlePreview");
const bodyPreview = document.querySelector("#bodyPreview");
const footerPreview = document.querySelector("#footerPreview");
const monogram = document.querySelector("#monogram");
const artBox = document.querySelector("#artBox");
const resetButton = document.querySelector("#resetButton");
const addLineButton = document.querySelector("#addLineButton");
const downloadButton = document.querySelector("#downloadButton");
const printButton = document.querySelector("#printButton");
const printNineButton = document.querySelector("#printNineButton");
const quickSaveButton = document.querySelector("#quickSaveButton");
const aboutButton = document.querySelector("#aboutButton");
const templateButtons = document.querySelectorAll(".template-button");
const swatches = document.querySelectorAll(".swatch");
const exportCanvas = document.querySelector("#exportCanvas");
const imageUpload = document.querySelector("#imageUpload");
const customFrameUpload = document.querySelector("#customFrameUpload");
const removeImageButton = document.querySelector("#removeImageButton");
const cardName = document.querySelector("#cardName");
const saveCardButton = document.querySelector("#saveCardButton");
const newCardButton = document.querySelector("#newCardButton");
const saveStatus = document.querySelector("#saveStatus");
const savedCardsList = document.querySelector("#savedCardsList");
const printSheet = document.querySelector("#printSheet");
const printSlotSelects = document.querySelectorAll(".print-slot-select");

const defaults = structuredClone(state);
const storageKey = "pocket-card-studio.saved-cards.v1";
const customFrameStorageKey = "pocket-card-studio.custom-frames.v1";
const maxImageBytes = 2 * 1024 * 1024;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const allowedFrameTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const tooltip = document.createElement("div");
const tooltipDescriptions = {
  resetButton: "Reset the editor to the starter card and clear the current saved-card selection.",
  addLineButton: "Add a thin accent rule above the body text.",
  quickSaveButton: "Save the current card using the name in the Saved cards panel.",
  downloadButton: "Export the current card as a high-resolution PNG file.",
  printButton: "Open the browser print dialog with the card sized at 2.5 by 3.5 inches.",
  printNineButton: "Print the nine selected print sheet slots in a 3 by 3 grid on one letter-size page.",
  aboutButton: "Show information about Playing Card Studio.",
  backgroundColor: "Choose the main paper color of the card.",
  borderColor: "Choose the outside edge color.",
  frameStyle: "Choose a decorative frame treatment for the card edge.",
  customFrameUpload: "Upload one or more custom frame images. Recommended size is 750 x 1050 px, transparent PNG or WebP, under 2 MB.",
  borderWidth: "Adjust how thick the outside edge appears.",
  cornerRadius: "Round or square off the card corners.",
  titleText: "Set the large headline text on the card.",
  subtitleText: "Set the small uppercase text above the headline.",
  bodyText: "Write the main description or note content.",
  footerText: "Set the small label at the bottom left of the card.",
  textColor: "Set the title, subtitle, body, and footer text colors all at once.",
  titleColor: "Choose the color for the large title text.",
  subtitleColor: "Choose the color for the small subtitle text.",
  bodyColor: "Choose the color for the main body text.",
  footerColor: "Choose the color for the bottom footer text.",
  fontScale: "Increase or decrease the card text size.",
  cardName: "Name this design before saving it to your local card library.",
  saveCardButton: "Save this design in the browser on this computer.",
  newCardButton: "Start a fresh card without deleting saved cards.",
  monogramText: "Set the letters shown in the center mark when no picture is placed there.",
  shapeStyle: "Choose the shape used around the center mark or picture.",
  imageUpload: "Add a PNG, JPG, WebP, or GIF. Recommended size is 750 x 1050 px for full-card images, under 2 MB.",
  imagePlacement: "Choose whether the uploaded picture appears in the mark, top panel, background, or is hidden.",
  imageFit: "Cover crops the picture to fill the space; contain shows the whole picture.",
  imageOpacity: "Adjust how transparent the uploaded picture appears.",
  imagePositionX: "Move the picture left or right inside its frame.",
  imagePositionY: "Move the picture up or down inside its frame.",
  removeImageButton: "Remove the uploaded picture from the current card.",
  showGrid: "Add a subtle grid texture to the card background.",
  showBleed: "Show a dashed guide for keeping important content away from the edge.",
  showFooter: "Show or hide the bottom footer row.",
  ruleCount: "Set how many accent rules appear above the body text."
};
let customFrames = loadCustomFrames();
let savedCards = loadSavedCards();
let activeSavedId = "";

function syncStateFromField(key) {
  const field = fields[key];
  if (field.type === "checkbox") {
    state[key] = field.checked;
    return;
  }

  if (field.type === "range" || field.type === "number") {
    state[key] = Number(field.value);
    return;
  }

  state[key] = field.value;
}

function placeTooltip(target) {
  const rect = target.getBoundingClientRect();
  const gap = 10;
  const tipRect = tooltip.getBoundingClientRect();
  let left = rect.left + rect.width / 2 - tipRect.width / 2;
  let top = rect.bottom + gap;

  if (left < 12) {
    left = 12;
  }
  if (left + tipRect.width > window.innerWidth - 12) {
    left = window.innerWidth - tipRect.width - 12;
  }
  if (top + tipRect.height > window.innerHeight - 12) {
    top = rect.top - tipRect.height - gap;
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${Math.max(12, top)}px`;
}

function showTooltip(target) {
  const message = target.dataset.tooltip;
  if (!message) {
    return;
  }

  tooltip.textContent = message;
  tooltip.classList.add("visible");
  placeTooltip(target);
}

function hideTooltip() {
  tooltip.classList.remove("visible");
}

function attachTooltip(target, message) {
  if (!target || !message) {
    return;
  }

  target.dataset.tooltip = message;
  target.setAttribute("aria-description", message);
  target.removeAttribute("title");
  target.addEventListener("mouseenter", () => showTooltip(target));
  target.addEventListener("mousemove", () => placeTooltip(target));
  target.addEventListener("mouseleave", hideTooltip);
  target.addEventListener("focus", () => showTooltip(target));
  target.addEventListener("blur", hideTooltip);
}

function updateSelectTooltip(key) {
  const field = fields[key];
  if (!field) {
    return;
  }

  const selected = field.options[field.selectedIndex];
  const optionTip = selected ? selected.dataset.tooltip : "";
  field.dataset.tooltip = optionTip || tooltipDescriptions[key] || "";
}

function setupTooltips() {
  tooltip.className = "hover-tip";
  tooltip.setAttribute("role", "tooltip");
  document.body.append(tooltip);

  Object.entries(fields).forEach(([key, field]) => {
    attachTooltip(field, tooltipDescriptions[key]);
  });
  attachTooltip(customFrameUpload, tooltipDescriptions.customFrameUpload);

  printSlotSelects.forEach((select) => {
    attachTooltip(select, `Choose which card prints in slot ${select.dataset.slot}.`);
  });

  [
    resetButton,
    addLineButton,
    quickSaveButton,
    downloadButton,
    printButton,
    printNineButton,
    aboutButton,
    saveCardButton,
    newCardButton,
    removeImageButton
  ].forEach((button) => {
    attachTooltip(button, tooltipDescriptions[button.id]);
  });

  templateButtons.forEach((button) => {
    const tips = {
      classic: "Use a traditional layout with a centered mark and balanced text areas.",
      split: "Use a wide picture or mark area with a top accent band.",
      badge: "Use a centered badge-style layout with a bottom accent bar."
    };
    attachTooltip(button, tips[button.dataset.template]);
  });

  swatches.forEach((swatch) => {
    attachTooltip(swatch, `Apply the ${swatch.getAttribute("aria-label")} color palette.`);
  });

  const shapeTips = {
    circle: "Use a round frame for the center mark.",
    diamond: "Use a rotated square frame for the center mark.",
    square: "Use a square frame for the center mark.",
    none: "Hide the frame around the center mark."
  };
  const placementTips = {
    mark: "Place the uploaded picture inside the center mark area.",
    top: "Place the uploaded picture in a wide top panel.",
    background: "Use the uploaded picture as the card background.",
    none: "Keep the uploaded picture saved but hidden from the card."
  };
  const fitTips = {
    cover: "Fill the image space, cropping edges if needed.",
    contain: "Show the full image, leaving empty space if needed."
  };
  const frameTips = {
    classic: "A clean card edge that follows your border color and width.",
    fantasy: "A magical filigree-inspired frame with glowing inner accents.",
    dungeon: "A rugged stone-like frame for dungeon and tabletop adventure cards.",
    victorian: "An ornate double-line frame inspired by Victorian print decoration.",
    wood: "A warm carved-wood frame with grain-like edge shading.",
    plastic: "A smooth glossy frame with a molded, modern toy-card feel.",
    metal: "A cool brushed-metal frame with crisp inner highlights.",
    modern: "A thin minimalist frame for clean contemporary cards."
  };

  Array.from(fields.shapeStyle.options).forEach((option) => {
    option.dataset.tooltip = shapeTips[option.value];
  });
  Array.from(fields.imagePlacement.options).forEach((option) => {
    option.dataset.tooltip = placementTips[option.value];
  });
  Array.from(fields.imageFit.options).forEach((option) => {
    option.dataset.tooltip = fitTips[option.value];
  });
  Array.from(fields.frameStyle.options).forEach((option) => {
    option.dataset.tooltip = frameTips[option.value];
  });

  ["shapeStyle", "imagePlacement", "imageFit", "frameStyle"].forEach((key) => {
    updateSelectTooltip(key);
    fields[key].addEventListener("change", () => updateSelectTooltip(key));
    fields[key].addEventListener("input", () => updateSelectTooltip(key));
  });

  window.addEventListener("scroll", hideTooltip, true);
  window.addEventListener("resize", hideTooltip);
}

function setFieldsFromState() {
  renderCustomFrameOptions();
  Object.entries(fields).forEach(([key, field]) => {
    if (field.type === "checkbox") {
      field.checked = state[key];
    } else {
      field.value = state[key];
    }
  });
}

function setActiveTemplate(template) {
  state.template = template;
  templateButtons.forEach((button) => {
    const active = button.dataset.template === state.template;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  updateSelectTooltip("shapeStyle");
  updateSelectTooltip("imagePlacement");
  updateSelectTooltip("imageFit");
  updateSelectTooltip("frameStyle");
}

function setSaveStatus(message) {
  saveStatus.textContent = message;
  if (!message) {
    return;
  }

  window.clearTimeout(setSaveStatus.timeoutId);
  setSaveStatus.timeoutId = window.setTimeout(() => {
    saveStatus.textContent = "";
  }, 2600);
}

function loadSavedCards() {
  try {
    const parsedCards = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (!Array.isArray(parsedCards)) {
      return [];
    }
    return parsedCards
      .filter((card) => card && typeof card === "object" && typeof card.id === "string")
      .map((card) => ({
        id: card.id,
        name: typeof card.name === "string" ? card.name : "Untitled card",
        snapshot: sanitizeSnapshot(card.snapshot),
        createdAt: typeof card.createdAt === "string" ? card.createdAt : "",
        updatedAt: typeof card.updatedAt === "string" ? card.updatedAt : ""
      }))
      .filter((card) => card.snapshot);
  } catch {
    return [];
  }
}

function persistSavedCards() {
  localStorage.setItem(storageKey, JSON.stringify(savedCards));
}

function loadCustomFrames() {
  try {
    const parsedFrames = JSON.parse(localStorage.getItem(customFrameStorageKey) || "[]");
    if (!Array.isArray(parsedFrames)) {
      return [];
    }
    return parsedFrames.filter((frame) => (
      frame &&
      typeof frame.id === "string" &&
      typeof frame.name === "string" &&
      isSafeFrameData(frame.data)
    ));
  } catch {
    return [];
  }
}

function persistCustomFrames() {
  localStorage.setItem(customFrameStorageKey, JSON.stringify(customFrames));
}

function createSnapshot() {
  return structuredClone(state);
}

function isSafeImageData(value) {
  if (!value) {
    return true;
  }
  if (typeof value !== "string") {
    return false;
  }
  return /^data:image\/(?:jpeg|png|webp|gif);base64,/i.test(value);
}

function isSafeFrameData(value) {
  if (!value || typeof value !== "string") {
    return false;
  }
  return /^data:image\/(?:jpeg|png|webp);base64,/i.test(value);
}

function isBuiltInFrameStyle(value) {
  return ["classic", "fantasy", "dungeon", "victorian", "wood", "plastic", "metal", "modern"].includes(value);
}

function getCustomFrame(value) {
  if (typeof value !== "string") {
    return null;
  }
  if (!value.startsWith("custom:")) {
    return null;
  }
  const frameId = value.slice("custom:".length);
  return customFrames.find((frame) => frame.id === frameId) || null;
}

function renderCustomFrameOptions() {
  fields.frameStyle.querySelectorAll("option[data-custom-frame='true']").forEach((option) => option.remove());
  customFrames.forEach((frame) => {
    const option = document.createElement("option");
    option.value = `custom:${frame.id}`;
    option.textContent = `Custom: ${frame.name}`;
    option.dataset.customFrame = "true";
    option.dataset.tooltip = `Use uploaded frame "${frame.name}".`;
    fields.frameStyle.append(option);
  });

  if (!isBuiltInFrameStyle(state.frameStyle) && !getCustomFrame(state.frameStyle)) {
    state.frameStyle = defaults.frameStyle;
  }
  fields.frameStyle.value = state.frameStyle;
  updateSelectTooltip("frameStyle");
}

function sanitizeSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object") {
    return null;
  }

  const sanitized = {};
  Object.keys(defaults).forEach((key) => {
    const defaultValue = defaults[key];
    const nextValue = snapshot[key];
    if (typeof nextValue === typeof defaultValue) {
      sanitized[key] = nextValue;
    } else {
      sanitized[key] = defaultValue;
    }
  });

  if (!["classic", "split", "badge"].includes(sanitized.template)) {
    sanitized.template = defaults.template;
  }
  if (!isBuiltInFrameStyle(sanitized.frameStyle) && !getCustomFrame(sanitized.frameStyle)) {
    sanitized.frameStyle = defaults.frameStyle;
  }
  if (!["circle", "diamond", "square", "none"].includes(sanitized.shapeStyle)) {
    sanitized.shapeStyle = defaults.shapeStyle;
  }
  if (!["mark", "top", "background", "none"].includes(sanitized.imagePlacement)) {
    sanitized.imagePlacement = defaults.imagePlacement;
  }
  if (!["cover", "contain"].includes(sanitized.imageFit)) {
    sanitized.imageFit = defaults.imageFit;
  }
  if (!isSafeImageData(sanitized.imageData)) {
    sanitized.imageData = "";
  }

  sanitized.borderWidth = Math.min(12, Math.max(0, sanitized.borderWidth));
  sanitized.cornerRadius = Math.min(24, Math.max(0, sanitized.cornerRadius));
  sanitized.fontScale = Math.min(130, Math.max(80, sanitized.fontScale));
  sanitized.imageOpacity = Math.min(100, Math.max(20, sanitized.imageOpacity));
  sanitized.imagePositionX = Math.min(100, Math.max(0, sanitized.imagePositionX));
  sanitized.imagePositionY = Math.min(100, Math.max(0, sanitized.imagePositionY));
  sanitized.ruleCount = Math.min(8, Math.max(0, sanitized.ruleCount));
  return sanitized;
}

function applySnapshot(snapshot) {
  const sanitizedSnapshot = sanitizeSnapshot(snapshot);
  if (!sanitizedSnapshot) {
    setSaveStatus("Could not load this card.");
    return;
  }
  Object.assign(state, structuredClone(defaults), sanitizedSnapshot);
  imageUpload.value = "";
  setFieldsFromState();
  setActiveTemplate(state.template);
  cardName.value = state.titleText || "Untitled card";
  render();
}

function appendPrintSlotOption(select, value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  select.append(option);
}

function renderPrintSlotOptions() {
  printSlotSelects.forEach((select) => {
    const previousValue = select.value || "current";
    select.replaceChildren();
    appendPrintSlotOption(select, "current", "Current");
    savedCards.forEach((card) => appendPrintSlotOption(select, `saved:${card.id}`, card.name));
    appendPrintSlotOption(select, "blank", "Blank");

    const hasPreviousValue = Array.from(select.options).some((option) => option.value === previousValue);
    select.value = hasPreviousValue ? previousValue : "current";
  });
}

function renderSavedCards() {
  savedCardsList.replaceChildren();
  if (!savedCards.length) {
    const empty = document.createElement("div");
    empty.className = "saved-card-empty";
    empty.textContent = "No saved cards yet.";
    savedCardsList.append(empty);
    renderPrintSlotOptions();
    return;
  }

  savedCards.forEach((card) => {
    const row = document.createElement("div");
    row.className = "saved-card";

    const name = document.createElement("div");
    name.className = "saved-card-name";
    name.title = card.name;
    name.textContent = card.name;

    const loadButton = document.createElement("button");
    loadButton.type = "button";
    loadButton.textContent = "Load";
    attachTooltip(loadButton, `Load "${card.name}" into the editor.`);
    loadButton.addEventListener("click", () => {
      activeSavedId = card.id;
      applySnapshot(card.snapshot);
      cardName.value = card.name;
      setSaveStatus("Loaded.");
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    attachTooltip(deleteButton, `Delete "${card.name}" from saved cards.`);
    deleteButton.addEventListener("click", () => {
      savedCards = savedCards.filter((savedCard) => savedCard.id !== card.id);
      if (activeSavedId === card.id) {
        activeSavedId = "";
      }
      persistSavedCards();
      renderSavedCards();
      setSaveStatus("Deleted.");
    });

    row.append(name, loadButton, deleteButton);
    savedCardsList.append(row);
  });
  renderPrintSlotOptions();
}

function saveCurrentCard() {
  const cleanName = cardName.value.trim() || state.titleText.trim() || "Untitled card";
  const now = new Date().toISOString();
  const snapshot = createSnapshot();
  const existingIndex = savedCards.findIndex((card) => card.id === activeSavedId);
  const previousSavedCards = structuredClone(savedCards);
  const previousActiveSavedId = activeSavedId;

  if (existingIndex >= 0) {
    savedCards[existingIndex] = {
      ...savedCards[existingIndex],
      name: cleanName,
      snapshot,
      updatedAt: now
    };
  } else {
    activeSavedId = `card-${Date.now()}`;
    savedCards.unshift({
      id: activeSavedId,
      name: cleanName,
      snapshot,
      createdAt: now,
      updatedAt: now
    });
  }

  try {
    persistSavedCards();
    renderSavedCards();
    setSaveStatus("Saved.");
  } catch {
    savedCards = previousSavedCards;
    activeSavedId = previousActiveSavedId;
    renderSavedCards();
    setSaveStatus("Could not save. Try removing a large image.");
  }
}

function initialsFromTitle(title) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "PC";
}

function renderRules() {
  preview.querySelectorAll(".rule").forEach((rule) => rule.remove());
  for (let index = 0; index < state.ruleCount; index += 1) {
    const rule = document.createElement("div");
    rule.className = "rule";
    bodyPreview.before(rule);
  }
}

function renderCustomFrame() {
  preview.querySelectorAll(".custom-frame-image").forEach((image) => image.remove());
  const frame = getCustomFrame(state.frameStyle);
  if (!frame) {
    return;
  }

  const image = document.createElement("img");
  image.src = frame.data;
  image.alt = "";
  image.className = "custom-frame-image";
  preview.append(image);
}

function clearPreviewImages() {
  preview.querySelectorAll(".card-image-background, .top-image, .uploaded-image").forEach((imageElement) => {
    imageElement.remove();
  });
  artBox.classList.remove("has-image");
  preview.classList.remove("has-background-image");
  artBox.style.display = "";
}

function createUploadedImage(className) {
  const image = document.createElement("img");
  image.src = state.imageData;
  image.alt = "";
  image.className = className;
  image.classList.toggle("contain", state.imageFit === "contain");
  image.style.opacity = state.imageOpacity / 100;
  image.style.objectPosition = `${state.imagePositionX}% ${state.imagePositionY}%`;
  return image;
}

function renderImage() {
  clearPreviewImages();
  if (!state.imageData || state.imagePlacement === "none") {
    return;
  }

  if (state.imagePlacement === "background") {
    const image = createUploadedImage("card-image-background");
    image.style.objectFit = state.imageFit;
    preview.prepend(image);
    preview.classList.add("has-background-image");
    return;
  }

  if (state.imagePlacement === "top") {
    const imageFrame = document.createElement("div");
    imageFrame.className = "top-image";
    imageFrame.append(createUploadedImage(""));
    preview.insertBefore(imageFrame, artBox);
    artBox.style.display = "none";
    return;
  }

  artBox.append(createUploadedImage("uploaded-image"));
  artBox.classList.add("has-image");
}

function render() {
  document.documentElement.style.setProperty("--card-bg", state.backgroundColor);
  document.documentElement.style.setProperty("--accent", state.accentColor);
  document.documentElement.style.setProperty("--card-border", state.borderColor);
  document.documentElement.style.setProperty("--border-width", `${state.borderWidth}px`);
  document.documentElement.style.setProperty("--corner-radius", `${state.cornerRadius}px`);
  document.documentElement.style.setProperty("--card-text", state.textColor);
  document.documentElement.style.setProperty("--title-text", state.titleColor);
  document.documentElement.style.setProperty("--subtitle-text", state.subtitleColor);
  document.documentElement.style.setProperty("--body-text", state.bodyColor);
  document.documentElement.style.setProperty("--footer-text", state.footerColor);
  document.documentElement.style.setProperty("--font-scale", state.fontScale / 100);

  titlePreview.textContent = state.titleText || "Untitled";
  subtitlePreview.textContent = state.subtitleText || "Custom card";
  bodyPreview.textContent = state.bodyText || "";
  footerPreview.textContent = state.footerText || "";
  monogram.textContent = state.monogramText || initialsFromTitle(state.titleText);

  const frameClass = isBuiltInFrameStyle(state.frameStyle) ? `frame-${state.frameStyle}` : "frame-custom";
  preview.className = `card-preview ${state.template} ${frameClass}`;
  preview.classList.toggle("show-grid", state.showGrid);
  preview.classList.toggle("show-bleed", state.showBleed);
  preview.classList.toggle("hide-footer", !state.showFooter);

  artBox.className = `art-box ${state.shapeStyle}`;
  renderRules();
  renderImage();
  renderCustomFrame();
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
  ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
  ctx.arcTo(x, y + height, x, y, safeRadius);
  ctx.arcTo(x, y, x + width, y, safeRadius);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(/\s+/);
  let line = "";
  let currentY = y;

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  });

  if (line) {
    ctx.fillText(line, x, currentY);
  }

  return currentY + lineHeight;
}

function loadExportImage() {
  if (!state.imageData || state.imagePlacement === "none") {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = state.imageData;
  });
}

function drawImageInRect(ctx, image, x, y, width, height, fit, opacity) {
  if (!image) {
    return;
  }

  const imageRatio = image.naturalWidth / image.naturalHeight;
  const boxRatio = width / height;
  let drawWidth = width;
  let drawHeight = height;
  let drawX = x;
  let drawY = y;
  const positionX = state.imagePositionX / 100;
  const positionY = state.imagePositionY / 100;

  if ((fit === "cover" && imageRatio > boxRatio) || (fit === "contain" && imageRatio < boxRatio)) {
    drawHeight = height;
    drawWidth = height * imageRatio;
    drawX = x + (width - drawWidth) * positionX;
  } else {
    drawWidth = width;
    drawHeight = width / imageRatio;
    drawY = y + (height - drawHeight) * positionY;
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();
  ctx.globalAlpha = opacity;
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  ctx.restore();
}

function drawMark(ctx, image, cx, cy, markSize, scale) {
  const markX = cx - markSize / 2;
  const markY = cy - markSize / 2;
  ctx.strokeStyle = state.accentColor;
  ctx.lineWidth = 7;
  ctx.save();

  if (state.shapeStyle === "diamond") {
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI / 4);
    if (image && state.imagePlacement === "mark") {
      drawImageInRect(ctx, image, -markSize / 2, -markSize / 2, markSize, markSize, state.imageFit, state.imageOpacity / 100);
    }
    if (state.shapeStyle !== "none") {
      ctx.strokeRect(-markSize / 2, -markSize / 2, markSize, markSize);
    }
    ctx.restore();
  } else {
    if (state.shapeStyle === "circle") {
      ctx.beginPath();
      ctx.arc(cx, cy, markSize / 2, 0, Math.PI * 2);
      if (image && state.imagePlacement === "mark") {
        ctx.save();
        ctx.clip();
        drawImageInRect(ctx, image, markX, markY, markSize, markSize, state.imageFit, state.imageOpacity / 100);
        ctx.restore();
      }
      ctx.stroke();
    } else if (state.shapeStyle === "square" || state.shapeStyle === "none") {
      if (image && state.imagePlacement === "mark") {
        drawImageInRect(ctx, image, markX, markY, markSize, markSize, state.imageFit, state.imageOpacity / 100);
      }
      if (state.shapeStyle !== "none") {
        ctx.strokeRect(markX, markY, markSize, markSize);
      }
    }
    ctx.restore();
  }

  if (!image || state.imagePlacement !== "mark") {
    ctx.fillStyle = state.accentColor;
    ctx.font = `900 ${72 * scale}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(state.monogramText || initialsFromTitle(state.titleText), cx, cy);
  }
}

function drawInsetFrame(ctx, width, height, scale, colors) {
  colors.forEach((color, index) => {
    const inset = (5 + index * 8) * scale;
    drawRoundedRect(ctx, inset, inset, width - inset * 2, height - inset * 2, Math.max(0, state.cornerRadius * scale - inset / 3));
    ctx.lineWidth = 3 * scale;
    ctx.strokeStyle = color;
    ctx.stroke();
  });
}

function drawExportFrame(ctx, width, height, scale, radius) {
  const customFrame = getCustomFrame(state.frameStyle);
  if (customFrame) {
    return;
  }

  if (state.frameStyle === "classic") {
    return;
  }

  if (state.frameStyle === "fantasy") {
    drawInsetFrame(ctx, width, height, scale, [state.accentColor, "#f5df9a", "#7d5b22"]);
  } else if (state.frameStyle === "dungeon") {
    drawInsetFrame(ctx, width, height, scale, ["#70757a", "#34383c", "#17191c"]);
  } else if (state.frameStyle === "victorian") {
    drawInsetFrame(ctx, width, height, scale, ["#d6b15c", "#1f1a14", "#d6b15c"]);
  } else if (state.frameStyle === "wood") {
    drawInsetFrame(ctx, width, height, scale, ["#9a6236", "#4d2916", "#b9824f"]);
  } else if (state.frameStyle === "plastic") {
    drawInsetFrame(ctx, width, height, scale, ["rgba(255,255,255,.72)", state.accentColor]);
  } else if (state.frameStyle === "metal") {
    drawInsetFrame(ctx, width, height, scale, ["#c4c9cf", "#737982", "#ffffff"]);
  } else if (state.frameStyle === "modern") {
    drawRoundedRect(ctx, 8 * scale, 8 * scale, width - 16 * scale, height - 16 * scale, Math.max(0, radius - 4 * scale));
    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = state.accentColor;
    ctx.stroke();
  }
}

function loadCustomFrameImage() {
  const customFrame = getCustomFrame(state.frameStyle);
  if (!customFrame) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = customFrame.data;
  });
}

async function downloadPng() {
  const uploadedImage = await loadExportImage();
  const customFrameImage = await loadCustomFrameImage();
  const ctx = exportCanvas.getContext("2d");
  const width = exportCanvas.width;
  const height = exportCanvas.height;
  const scale = width / 375;
  const pad = 24 * scale;
  const radius = state.cornerRadius * scale;

  ctx.clearRect(0, 0, width, height);
  drawRoundedRect(ctx, 0, 0, width, height, radius);
  ctx.fillStyle = state.backgroundColor;
  ctx.fill();
  ctx.clip();

  if (uploadedImage && state.imagePlacement === "background") {
    drawImageInRect(ctx, uploadedImage, 0, 0, width, height, state.imageFit, state.imageOpacity / 100);
    ctx.fillStyle = state.backgroundColor;
    ctx.globalAlpha = .42;
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;
  }

  if (state.showGrid) {
    ctx.strokeStyle = "rgba(0,0,0,.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 44) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 44) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  ctx.textBaseline = "top";
  ctx.font = `700 ${22 * scale}px Arial`;
  ctx.fillStyle = state.subtitleColor;
  ctx.fillText(state.subtitleText || "Custom card", pad, pad);

  ctx.fillStyle = state.titleColor;
  ctx.font = `700 ${54 * (state.fontScale / 100) * scale}px Georgia`;
  wrapText(ctx, state.titleText || "Untitled", pad, pad + 42, width - pad * 2, 58 * scale);

  const cx = width / 2;
  const cy = height * (state.template === "badge" ? .42 : .47);
  const markSize = width * .3;

  if (uploadedImage && state.imagePlacement === "top") {
    const topX = pad;
    const topY = height * .34;
    const topWidth = width - pad * 2;
    const topHeight = topWidth / (state.template === "split" ? 1.8 : 1.45);
    drawImageInRect(ctx, uploadedImage, topX, topY, topWidth, topHeight, state.imageFit, state.imageOpacity / 100);
    ctx.strokeStyle = state.accentColor;
    ctx.lineWidth = 6;
    ctx.strokeRect(topX, topY, topWidth, topHeight);
  } else {
    drawMark(ctx, uploadedImage, cx, cy, markSize, scale);
  }

  ctx.fillStyle = state.bodyColor;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = `${27 * (state.fontScale / 100) * scale}px Arial`;
  const bodyTop = height - 255;
  wrapText(ctx, state.bodyText || "", pad, bodyTop, width - pad * 2, 38 * scale);

  if (state.showFooter) {
    ctx.strokeStyle = state.accentColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(pad, height - 82);
    ctx.lineTo(width - pad, height - 82);
    ctx.stroke();
    ctx.fillStyle = state.footerColor;
    ctx.font = `700 ${20 * scale}px Arial`;
    ctx.fillText(state.footerText || "", pad, height - 58);
    ctx.textAlign = "right";
    ctx.fillText("2.5 x 3.5", width - pad, height - 58);
  }

  ctx.restore();
  drawRoundedRect(ctx, state.borderWidth / 2, state.borderWidth / 2, width - state.borderWidth, height - state.borderWidth, radius);
  ctx.lineWidth = Math.max(1, state.borderWidth * scale);
  ctx.strokeStyle = state.borderColor;
  ctx.stroke();
  drawExportFrame(ctx, width, height, scale, radius);
  if (customFrameImage) {
    ctx.drawImage(customFrameImage, 0, 0, width, height);
  }

  const link = document.createElement("a");
  link.download = "custom-2-5x3-5-card.png";
  link.href = exportCanvas.toDataURL("image/png");
  link.click();
}

function cleanPrintCard(cardElement) {
  cardElement.removeAttribute("id");
  cardElement.setAttribute("aria-hidden", "true");
  cardElement.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
  return cardElement;
}

function cloneCardFromSnapshot(snapshot) {
  const sanitizedSnapshot = sanitizeSnapshot(snapshot);
  if (!sanitizedSnapshot) {
    const blankCard = document.createElement("div");
    blankCard.className = "blank-print-card";
    return blankCard;
  }

  Object.assign(state, structuredClone(defaults), sanitizedSnapshot);
  imageUpload.value = "";
  setFieldsFromState();
  setActiveTemplate(state.template);
  render();
  return cleanPrintCard(preview.cloneNode(true));
}

function findPrintSlotSnapshot(value, currentSnapshot) {
  if (value === "blank") {
    return null;
  }
  if (value === "current") {
    return currentSnapshot;
  }

  const savedId = value.replace("saved:", "");
  const savedCard = savedCards.find((card) => card.id === savedId);
  return savedCard ? savedCard.snapshot : currentSnapshot;
}

function buildPrintSheet() {
  const originalSnapshot = createSnapshot();
  const originalCardName = cardName.value;
  printSheet.replaceChildren();

  printSlotSelects.forEach((select) => {
    const snapshot = findPrintSlotSnapshot(select.value, originalSnapshot);
    if (!snapshot) {
      const blankCard = document.createElement("div");
      blankCard.className = "blank-print-card";
      printSheet.append(blankCard);
      return;
    }
    printSheet.append(cloneCardFromSnapshot(snapshot));
  });

  Object.assign(state, structuredClone(defaults), originalSnapshot);
  imageUpload.value = "";
  cardName.value = originalCardName;
  setFieldsFromState();
  setActiveTemplate(state.template);
  render();
}

function printNineCards() {
  buildPrintSheet();
  document.body.classList.add("print-nine");
  window.print();
}

Object.keys(fields).forEach((key) => {
  fields[key].addEventListener("input", () => {
    syncStateFromField(key);
    render();
  });
});

fields.textColor.addEventListener("input", () => {
  state.titleColor = state.textColor;
  state.subtitleColor = state.textColor;
  state.bodyColor = state.textColor;
  state.footerColor = state.textColor;
  fields.titleColor.value = state.titleColor;
  fields.subtitleColor.value = state.subtitleColor;
  fields.bodyColor.value = state.bodyColor;
  fields.footerColor.value = state.footerColor;
  render();
});

imageUpload.addEventListener("change", () => {
  const [file] = imageUpload.files;
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const imageData = String(reader.result);
    if (!isSafeImageData(imageData)) {
      setSaveStatus("Use PNG, JPG, WebP, or GIF.");
      imageUpload.value = "";
      return;
    }
    state.imageData = imageData;
    if (state.imagePlacement === "none") {
      state.imagePlacement = "mark";
      fields.imagePlacement.value = "mark";
    }
    render();
  });

  if (!allowedImageTypes.has(file.type)) {
    setSaveStatus("Use PNG, JPG, WebP, or GIF.");
    imageUpload.value = "";
    return;
  }
  if (file.size > maxImageBytes) {
    setSaveStatus("Image must be under 2 MB.");
    imageUpload.value = "";
    return;
  }

  reader.readAsDataURL(file);
});

customFrameUpload.addEventListener("change", () => {
  const files = Array.from(customFrameUpload.files || []);
  if (!files.length) {
    return;
  }

  const validFiles = files.filter((file) => {
    if (!allowedFrameTypes.has(file.type)) {
      setSaveStatus("Frames must be PNG, JPG, or WebP.");
      return false;
    }
    if (file.size > maxImageBytes) {
      setSaveStatus("Each frame must be under 2 MB.");
      return false;
    }
    return true;
  });

  if (!validFiles.length) {
    customFrameUpload.value = "";
    return;
  }

  Promise.all(validFiles.map((file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const frameData = String(reader.result);
      if (!isSafeFrameData(frameData)) {
        resolve(null);
        return;
      }
      resolve({
        id: `frame-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: file.name.replace(/\.[^.]+$/, "").slice(0, 42) || "Uploaded frame",
        data: frameData
      });
    });
    reader.readAsDataURL(file);
  }))).then((frames) => {
    const addedFrames = frames.filter(Boolean);
    if (!addedFrames.length) {
      setSaveStatus("Could not read frame image.");
      customFrameUpload.value = "";
      return;
    }

    const previousFrames = structuredClone(customFrames);
    customFrames = [...customFrames, ...addedFrames];
    try {
      persistCustomFrames();
      state.frameStyle = `custom:${addedFrames[addedFrames.length - 1].id}`;
      renderCustomFrameOptions();
      setFieldsFromState();
      render();
      setSaveStatus(`${addedFrames.length} frame${addedFrames.length === 1 ? "" : "s"} added.`);
    } catch {
      customFrames = previousFrames;
      renderCustomFrameOptions();
      setSaveStatus("Could not save frame. Try a smaller image.");
    }
    customFrameUpload.value = "";
  });
});

removeImageButton.addEventListener("click", () => {
  state.imageData = "";
  imageUpload.value = "";
  render();
});

templateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveTemplate(button.dataset.template);
    render();
  });
});

swatches.forEach((swatch) => {
  swatch.addEventListener("click", () => {
    state.backgroundColor = swatch.dataset.bg;
    state.accentColor = swatch.dataset.accent;
    state.textColor = swatch.dataset.text;
    state.titleColor = swatch.dataset.text;
    state.subtitleColor = swatch.dataset.accent;
    state.bodyColor = swatch.dataset.text;
    state.footerColor = swatch.dataset.text;
    setFieldsFromState();
    render();
  });
});

addLineButton.addEventListener("click", () => {
  state.ruleCount = Math.min(8, state.ruleCount + 1);
  fields.ruleCount.value = state.ruleCount;
  render();
});

resetButton.addEventListener("click", () => {
  Object.assign(state, structuredClone(defaults));
  activeSavedId = "";
  imageUpload.value = "";
  cardName.value = state.titleText;
  setFieldsFromState();
  setActiveTemplate(state.template);
  render();
});

saveCardButton.addEventListener("click", saveCurrentCard);
quickSaveButton.addEventListener("click", saveCurrentCard);

newCardButton.addEventListener("click", () => {
  Object.assign(state, structuredClone(defaults));
  activeSavedId = "";
  imageUpload.value = "";
  cardName.value = state.titleText;
  setFieldsFromState();
  setActiveTemplate(state.template);
  render();
  setSaveStatus("New card started.");
});

downloadButton.addEventListener("click", downloadPng);
printButton.addEventListener("click", () => window.print());
printNineButton.addEventListener("click", printNineCards);
aboutButton.addEventListener("click", () => {
  window.alert("Playing Card Studio developed by Politically Incorrect Software Systems with assistance from Codex by OpenAI.");
});
window.addEventListener("afterprint", () => {
  document.body.classList.remove("print-nine");
  printSheet.replaceChildren();
});

setupTooltips();
renderCustomFrameOptions();
setFieldsFromState();
setActiveTemplate(state.template);
renderSavedCards();
render();