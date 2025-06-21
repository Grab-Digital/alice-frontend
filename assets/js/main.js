console.warn("Designed and Developed by Grab Digital (2025)");

window.addEventListener("DOMContentLoaded", () => {
  initMaskTel();
  initFancy();
  initScroll();
  filter();
  initProfitsSwiper();
  AOS.init();
  initStrapi();
  sendForm();

  function initStrapi() {
    fetch("https://alice-backend-oog7.onrender.com/api/works?populate=*")
      .then((response) => response.json())
      .then((data) => {
        console.log("Полученные данные:", data);

        if (!data.data || data.data.length === 0) {
          console.error("Нет данных или коллекция пуста!");
          return;
        }

        const container = document.querySelector(".projects__cards");
        container.innerHTML = "";

        data.data.forEach((work) => {
          const workData = work;
          const title = workData.title || "Без названия";
          const description = workData.description || "";
          const link = workData.link || "#";
          const tag = workData.tag || "Проект";

          const imageUrl = workData.image?.url
            ? `https://alice-backend-oog7.onrender.com${workData.image.url}`
            : "./assets/img/projects-img.png";

          const task = workData.task || "";
          const solution = workData.solution || "";
          const structure = workData.structure || [];
          const result = workData.result || "";
          const behanceLink = workData.behanceLink || "#";

          const card = document.createElement("div");
          card.className = "projects__cards-item";
          card.dataset.category = tag.toLowerCase().replace(/\s+/g, "-");
          card.setAttribute("data-aos", "fade-up");
          card.setAttribute("data-aos-duration", "2000");

          const img = document.createElement("img");
          img.className = "projects__cards-item-img";
          img.src = imageUrl;
          img.alt = title;
          card.appendChild(img);

          const infoBlock = document.createElement("div");
          infoBlock.className = "projects__cards-item-info";

          const titleSpan = document.createElement("span");
          titleSpan.className = "projects__cards-item-info-title";
          titleSpan.textContent = title.toUpperCase();
          infoBlock.appendChild(titleSpan);

          const tagSpan = document.createElement("span");
          tagSpan.className = "projects__cards-item-info-tag";
          tagSpan.textContent = tag;
          infoBlock.appendChild(tagSpan);

          card.appendChild(infoBlock);

          const moreLink = document.createElement("a");
          moreLink.className = "projects__cards-item-more";
          moreLink.href = "#modal-project";
          moreLink.textContent = "Читать подробнее";
          moreLink.setAttribute("data-fancybox", "");

          moreLink.addEventListener("click", () => {
            openModal({
              title,
              tag,
              image: imageUrl,
              description,
              task,
              solution,
              structure,
              result,
              behanceLink,
            });
          });

          card.appendChild(moreLink);
          container.appendChild(card);
        });
      })
      .then(() => {
        filter();
      })
      .catch((error) => {
        console.error("Ошибка:", error);
      });
  }

  function openModal(data) {
    const modal = document.getElementById("modal-project");

    modal.querySelector(".modal-project-img").src = data.image;
    modal.querySelector(".modal-project-tag").textContent = data.tag;
    modal.querySelector(".modal-title").textContent = data.title;
    modal.querySelector(".short-desc").textContent = data.description;
    modal.querySelector(".task").textContent = data.task;
    modal.querySelector(".solution").textContent = data.solution;
    modal.querySelector(".result").textContent = data.result;
    modal.querySelector(".modal-link").href = data.behanceLink;

    const structureList = modal.querySelector(".structure-list");
    structureList.innerHTML = "";

    if (Array.isArray(data.structure)) {
      data.structure.forEach((item) => {
        const li = document.createElement("li");
        li.className = "modal-list";
        li.textContent = item;
        structureList.appendChild(li);
      });
    }
  }

  function sendForm() {
    document.querySelectorAll("form").forEach((form) => {
      form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {};

        for (let [name, value] of formData.entries()) {
          if (value.trim() !== "") {
            data[name] = value;
          }
        }

        // Добавим URL страницы
        data.url = window.location.href;

        try {
          const response = await fetch("/.netlify/functions/sendForm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          const currentModal = form.closest("[data-modal]");

          if (currentModal) {
            currentModal.classList.add("hidden");
          }

          if (response.ok) {
            form.reset();
            showModal("#modal-thanks");
          } else {
            showModal("#modal-error");
          }
        } catch (error) {
          console.error("Ошибка отправки:", error);
          showModal("#modal-error");
        }
      });
    });

    function showModal(selector) {
      document.querySelectorAll("[data-modal]").forEach((el) => {
        el.classList.add("hidden");
      });

      const modal = document.querySelector(selector);
      if (modal) {
        modal.classList.remove("hidden");

        modal.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      setTimeout(() => {
        modal?.classList.add("hidden");
      }, 5000);
    }
  }

  function initScroll() {
    window.addEventListener("scroll", (e) => {
      if (pageYOffset > 70) {
        $("header").addClass("js-scroll");
      } else {
        $("header").removeClass("js-scroll");
      }
    });
  }

  function initFancy() {
    Fancybox.bind("[data-fancybox]", {});
    Fancybox.defaults.autoFocus = false;
  }

  function initMaskTel() {
    $.fn.setCursorPosition = function (pos) {
      if ($(this).get(0).setSelectionRange) {
        $(this).get(0).setSelectionRange(pos, pos);
      } else if ($(this).get(0).createTextRange) {
        var range = $(this).get(0).createTextRange();
        range.collapse(true);
        range.moveEnd("character", pos);
        range.moveStart("character", pos);
        range.select();
      }
    };
    $.mask.definitions["~"] = "[49]";
    $("input[type='tel']")
      .click(function () {
        $(this).setCursorPosition(4);
      })
      .mask("+7 (~99) 999-99-99", {
        placeholder: "_",
      });
  }

  function initProfitsSwiper() {
    var swiper = new Swiper(".profits__list", {
      direction: "horizontal",
      slidesPerView: "auto",
      centeredSlides: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        991: {
          enabled: false,
        },
      },
    });
  }

  function filter() {
    const filterButtons = document.querySelectorAll(".projects__tabs-item");
    const loadMoreBtn = document.querySelector(".projects__showmore");

    let visibleItems = 6;
    let currentFilter = "all";

    function normalize(str) {
      return str.toLowerCase().replace(/[\s\/\-]+/g, "");
    }

    function getVisibleItems() {
      return Array.from(document.querySelectorAll(".projects__cards-item"));
    }

    function initPortfolio() {
      const portfolioItems = getVisibleItems();
      portfolioItems.forEach((item, index) => {
        item.classList.remove("projects__cards-item--filtered");
        item.classList.toggle("projects__cards-item--hidden", index >= visibleItems);
      });
      updateLoadMoreButton();
    }

    function updateLoadMoreButton() {
      const portfolioItems = getVisibleItems();

      const filteredItems = portfolioItems.filter((item) => {
        const matchesFilter =
          normalize(currentFilter) === "all" ||
          normalize(item.dataset.category) === normalize(currentFilter);
        return (
          matchesFilter && !item.classList.contains("projects__cards-item--filtered")
        );
      });

      const hiddenItems = filteredItems.filter((item) =>
        item.classList.contains("projects__cards-item--hidden")
      );

      if (loadMoreBtn) {
        loadMoreBtn.style.display = hiddenItems.length > 0 ? "block" : "none";
      }
    }

    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const portfolioItems = getVisibleItems();
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");
        currentFilter = this.dataset.filter;
        visibleItems = 6;

        const filteredItems = portfolioItems.filter((item) => {
          return (
            normalize(currentFilter) === "all" ||
            normalize(item.dataset.category) === normalize(currentFilter)
          );
        });

        portfolioItems.forEach((item) => {
          if (filteredItems.includes(item)) {
            item.classList.remove("projects__cards-item--filtered");
          } else {
            item.classList.add("projects__cards-item--filtered");
            item.classList.add("projects__cards-item--hidden");
          }
        });

        filteredItems.forEach((item, index) => {
          item.classList.toggle("projects__cards-item--hidden", index >= visibleItems);
        });

        updateLoadMoreButton();
      });
    });

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", function () {
        const portfolioItems = getVisibleItems();
        visibleItems += 6;

        let shown = 0;
        portfolioItems.forEach((item) => {
          const matchesFilter =
            normalize(currentFilter) === "all" ||
            normalize(item.dataset.category) === normalize(currentFilter);

          if (
            matchesFilter &&
            !item.classList.contains("projects__cards-item--filtered") &&
            shown < visibleItems
          ) {
            item.classList.remove("projects__cards-item--hidden");
            shown++;
          }
        });

        updateLoadMoreButton();
      });
    }

    initPortfolio();
  }

  function loadMore() {
    const filterButtons = document.querySelectorAll(".projects__tabs-item");
    const portfolioItems = document.querySelectorAll(".projects__cards-item");
    const loadMoreBtn = document.querySelector(".projects__showmore");
    let visibleItems = 6;
    let currentFilter = "all";

    function initPortfolio() {
      portfolioItems.forEach((item, index) => {
        if (index >= visibleItems) {
          item.classList.add("hidden-initially");
        }
      });

      updateLoadMoreButton();
    }

    function updateLoadMoreButton() {
      const visibleItemsInFilter = Array.from(portfolioItems).filter((item) => {
        const isVisible =
          !item.classList.contains("hide") &&
          !item.classList.contains("hidden-initially");
        const matchesFilter =
          currentFilter === "all" || item.dataset.category === currentFilter;
        return isVisible && matchesFilter;
      }).length;

      const totalInFilter = Array.from(portfolioItems).filter((item) => {
        return currentFilter === "all" || item.dataset.category === currentFilter;
      }).length;

      loadMoreBtn.style.display = visibleItemsInFilter < totalInFilter ? "block" : "none";
      console.log(`Видимых: ${visibleItemsInFilter}, Всего: ${totalInFilter}`);
    }

    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");
        currentFilter = this.dataset.filter;

        visibleItems = 6;

        portfolioItems.forEach((item, index) => {
          const matchesFilter =
            currentFilter === "all" || item.dataset.category === currentFilter;

          if (matchesFilter && index < visibleItems) {
            item.classList.remove("hide", "hidden-initially");
          } else if (matchesFilter) {
            item.classList.remove("hide");
            item.classList.add("hidden-initially");
          } else {
            item.classList.add("hide");
          }
        });

        visibleItems = 6;
        updateLoadMoreButton();
      });
    });

    loadMoreBtn.addEventListener("click", function () {
      visibleItems += 6;

      portfolioItems.forEach((item, index) => {
        const matchesFilter =
          currentFilter === "all" || item.dataset.category === currentFilter;
        if (matchesFilter && index < visibleItems) {
          item.classList.remove("hidden-initially");
        }
      });

      updateLoadMoreButton();
    });

    initPortfolio();
  }
});
