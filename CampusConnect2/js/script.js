// Campus Connect Living prototype interactions.
// Property data is sample academic-project content; no real booking is created.

const properties = [
  {
    id:"hatfield",
    name:"Hatfield Student Apartments",
    location:"Hatfield, Pretoria",
    area:"hatfield",
    price:3900,
    type:"private",
    distance:"1.1 km from campus",
    image:"https://images.unsplash.com/photo-1774226905114-1daa47ee03dc?auto=format&fit=crop&q=80",
    description:"Comfortable student accommodation close to shops, restaurants, public transport and educational institutions.",
    features:["Furnished","Wi-Fi","Study area","Laundry","Secure access"]
  },
  {
    id:"brooklyn",
    name:"Brooklyn Student Living",
    location:"Brooklyn, Pretoria",
    area:"brooklyn",
    price:4200,
    type:"private",
    distance:"2.0 km from campus",
    image:"https://images.unsplash.com/photo-1721521906533-7d763cbcd0a4?auto=format&fit=crop&q=80",
    description:"A modern student living option with convenient access to educational institutions, shopping centres and public transport.",
    features:["Furnished","Wi-Fi","Study area","Parking","Controlled access"]
  },
  {
    id:"lynnwood",
    name:"Lynnwood Student Apartments",
    location:"Lynnwood, Pretoria",
    area:"lynnwood",
    price:4500,
    type:"private",
    distance:"3.2 km from campus",
    image:"https://images.unsplash.com/photo-1721521907639-d1d5164ac013?auto=format&fit=crop&q=80",
    description:"A comfortable student accommodation option in Lynnwood with easy access to transport and nearby services.",
    features:["Private room","Wi-Fi","Laundry","Study space","Secure access"]
  },
  {
    id:"arcadia",
    name:"Arcadia Student Residence",
    location:"Arcadia, Pretoria",
    area:"arcadia",
    price:3700,
    type:"shared",
    distance:"4.0 km from campus",
    image:"https://images.unsplash.com/photo-1499955085172-a104c9463ece?auto=format&fit=crop&q=80",
    description:"An affordable shared-living option for students who want convenient access to public transport and essential services.",
    features:["Shared room","Wi-Fi","Study area","Kitchen","Laundry"]
  },
  {
    id:"sunnyside",
    name:"Sunnyside Student Apartments",
    location:"Sunnyside, Pretoria",
    area:"sunnyside",
    price:3800,
    type:"private",
    distance:"4.5 km from campus",
    image:"https://images.unsplash.com/photo-1499955085172-a104c9463ece?auto=format&fit=crop&q=80",
    description:"Affordable student accommodation near public transport, shops, restaurants and other essential services.",
    features:["Private room","Wi-Fi","Kitchen","Laundry","Secure access"]
  }
];

// Format prices consistently for the South African rand display.
function money(value){return "R"+value.toLocaleString("en-ZA");}

// Build one accommodation card, including responsive image attributes.
function propertyCard(p){
  return `<article class="property-card" data-area="${p.area}" data-type="${p.type}" data-price="${p.price}">
    <div class="property-image">
      <img src="${p.image}&w=960" srcset="${p.image}&w=640 640w, ${p.image}&w=960 960w" sizes="(max-width: 680px) 90vw, (max-width: 900px) 45vw, 31vw" alt="Illustrative student accommodation photo for ${p.name}" loading="lazy">
      <span class="property-badge">Student accommodation</span>
    </div>
    <div class="property-body">
      <h3>${p.name}</h3>
      <div class="location">⌖ ${p.location} · ${p.distance}</div>
      <div class="price">From ${money(p.price)} <small>/ month</small></div>
      <p class="location">${p.description}</p>
      <div class="features">${p.features.slice(0,4).map(f=>`<span class="chip">${f}</span>`).join("")}</div>
      <div class="card-actions">
        <button class="btn btn-primary" type="button" onclick="openProperty('${p.id}')">View details</button>
        <a class="btn btn-secondary" href="enquiry.html?property=${encodeURIComponent(p.name)}">Enquire</a>
      </div>
    </div>
  </article>`;
}

function renderFeatured(){
  const target=document.querySelector("#featured-properties");
  if(target) target.innerHTML=properties.slice(0,3).map(propertyCard).join("");
}

function renderProperties(list=properties){
  const target=document.querySelector("#property-list");
  const empty=document.querySelector("#no-results");
  const count=document.querySelector("#results-count");
  if(!target) return;
  target.innerHTML=list.map(propertyCard).join("");
  if(count) count.textContent=`${list.length} accommodation option${list.length===1?"":"s"} found`;
  if(empty) empty.style.display=list.length?"none":"block";
}

// Filter sample listings by the controls on the accommodation page.
function filterProperties(){
  const area=document.querySelector("#location-filter")?.value || "";
  const type=document.querySelector("#type-filter")?.value || "";
  const budget=Number(document.querySelector("#budget-filter")?.value || 0);
  const search=(document.querySelector("#keyword-filter")?.value || "").toLowerCase().trim();
  const list=properties.filter(p=>
    (!area || p.area===area) &&
    (!type || p.type===type) &&
    (!budget || p.price<=budget) &&
    (!search || `${p.name} ${p.location} ${p.description}`.toLowerCase().includes(search))
  );
  renderProperties(list);
}

// Carry the home-page search choices to the accommodation results page.
function bindSearch(){
  const form=document.querySelector("#property-search");
  if(!form) return;
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const area=document.querySelector("#home-location")?.value || "";
    const budget=document.querySelector("#home-budget")?.value || "";
    sessionStorage.setItem("campusArea",area);
    sessionStorage.setItem("campusBudget",budget);
    window.location.href="accommodation.html#results";
  });
}

function initAccommodation(){
  if(!document.querySelector("#property-list")) return;
  const area=sessionStorage.getItem("campusArea")||"";
  const budget=sessionStorage.getItem("campusBudget")||"";
  const areaEl=document.querySelector("#location-filter");
  const budgetEl=document.querySelector("#budget-filter");
  if(areaEl) areaEl.value=area;
  if(budgetEl) budgetEl.value=budget;
  renderProperties();
  document.querySelectorAll("#location-filter,#type-filter,#budget-filter").forEach(el=>el.addEventListener("change",filterProperties));
  document.querySelector("#keyword-filter")?.addEventListener("input",filterProperties);
  document.querySelector("#clear-filters")?.addEventListener("click",()=>{
    ["location-filter","type-filter","budget-filter","keyword-filter"].forEach(id=>{const e=document.getElementById(id);if(e)e.value="";});
    renderProperties();
  });
}

// Populate and open the property details modal.
function openProperty(id){
  const p=properties.find(x=>x.id===id);
  if(!p) return;
  const modal=document.querySelector("#property-modal");
  if(!modal) return;
  modal.querySelector(".modal-image").style.backgroundImage=`url('${p.image}')`;
  modal.querySelector(".modal-body").innerHTML=`
    <button class="modal-close" type="button" onclick="closeProperty()" aria-label="Close">×</button>
    <p class="eyebrow">${p.location}</p>
    <h2>${p.name}</h2>
    <p class="price">From ${money(p.price)} / month</p>
    <p>${p.description}</p>
    <p><strong>Room:</strong> ${p.type==="shared"?"Shared room":"Private room"} · <strong>Distance:</strong> ${p.distance}</p>
    <div class="features">${p.features.map(f=>`<span class="chip">${f}</span>`).join("")}</div>
    <a class="btn btn-primary" href="enquiry.html?property=${encodeURIComponent(p.name)}">Enquire about this property</a>`;
  modal.classList.add("show");
  document.body.style.overflow="hidden";
}
function closeProperty(){
  const modal=document.querySelector("#property-modal");
  if(modal) modal.classList.remove("show");
  document.body.style.overflow="";
}
window.addEventListener("keydown",e=>{if(e.key==="Escape")closeProperty()});

// Toggle the mobile navigation and keep its ARIA state in sync.
function initMenu(){
  const btn=document.querySelector(".menu-btn"), nav=document.querySelector(".nav");
  if(btn && nav) btn.addEventListener("click",()=>{
    const open=nav.classList.toggle("open");
    btn.setAttribute("aria-expanded",open?"true":"false");
    btn.setAttribute("aria-label",open?"Close navigation":"Open navigation");
  });
}

// Make FAQ answers keyboard-accessible and expose their expanded state.
function initFAQ(){
  document.querySelectorAll(".faq-question").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const item=btn.closest(".faq-item");
      document.querySelectorAll(".faq-item").forEach(x=>{if(x!==item)x.classList.remove("open")});
      const isOpen=item.classList.toggle("open");
      btn.setAttribute("aria-expanded",isOpen?"true":"false");
    });
  });
}


// Lightbox gallery: enlarge property photos on click, with Escape and close-button support.
function initImageLightbox(){
  if(!document.getElementById("image-lightbox")){
    const box=document.createElement("div");
    box.id="image-lightbox"; box.className="image-lightbox"; box.setAttribute("role","dialog");
    box.setAttribute("aria-modal","true"); box.setAttribute("aria-label","Enlarged accommodation image");
    box.innerHTML='<button type="button" class="image-lightbox-close" aria-label="Close enlarged image">×</button><img alt="Enlarged accommodation photograph">';
    document.body.appendChild(box);
    box.querySelector("button").addEventListener("click",closeImageLightbox);
    box.addEventListener("click",e=>{if(e.target===box)closeImageLightbox();});
  }
  document.addEventListener("click",e=>{
    const img=e.target.closest(".property-image img"); if(!img)return;
    const box=document.getElementById("image-lightbox"); const enlarged=box.querySelector("img");
    enlarged.src=img.currentSrc||img.src; enlarged.alt=img.alt; box.classList.add("show");
    document.body.style.overflow="hidden"; box.querySelector("button").focus();
  });
}
function closeImageLightbox(){
  const box=document.getElementById("image-lightbox"); if(box)box.classList.remove("show");
  if(!document.querySelector("#property-modal.show"))document.body.style.overflow="";
}

// Client-side validation and mailto hand-off. A static site cannot send email itself.
function initForms(){
  document.querySelectorAll("form[data-demo-form]").forEach(form=>{
    form.addEventListener("submit",e=>{
      e.preventDefault();
      if(!form.reportValidity()) return;
      const isEnquiry=location.pathname.toLowerCase().endsWith("enquiry.html");
      const subject=isEnquiry?"Campus Connect accommodation enquiry":"Campus Connect website contact message";
      const lines=[];
      form.querySelectorAll("input, select, textarea").forEach(field=>{
        if(!field.id || !field.value.trim()) return;
        const label=form.querySelector(`label[for="${field.id}"]`);
        lines.push(`${label ? label.textContent.replace(/\s*\*$/, "").trim() : field.id}: ${field.value.trim()}`);
      });
      const body=encodeURIComponent(lines.join("\n"));
      const mailto=`mailto:info@campusconnectliving.co.za?subject=${encodeURIComponent(subject)}&body=${body}`;
      const success=form.querySelector(".form-success") || form.parentElement.querySelector(".form-success");
      if(success){
        success.style.display="block";
        if(isEnquiry){
          const area=form.querySelector("#preferred-area")?.value||"your selected area";
          const budget=form.querySelector("#budget")?.value||"your selected budget";
          const room=form.querySelector("#room-type")?.value||"your selected room type";
          success.textContent=`Enquiry checked: you selected ${room} in ${area} with a budget of ${budget}. The site has sample listings only, so availability is not guaranteed. Your email application will open with your details; review and send it to contact the team.`;
        } else {success.textContent="Your email application will open with your contact details and message. Review it and press Send to submit it.";}
      }
      window.location.href=mailto;
    });
  });
  const params=new URLSearchParams(location.search);
  const property=params.get("property");
  const propField=document.querySelector("#property-interest");
  if(property && propField) propField.value=property;
}

document.addEventListener("DOMContentLoaded",()=>{
  renderFeatured();
  bindSearch();
  initAccommodation();
  initMenu();
  initFAQ();
  initForms();
  initImageLightbox();
});
