console.warn("Designed and Developed by Grab Digital (2025)");

window.addEventListener("DOMContentLoaded", () => {
  initMaskTel();
  initFancy();
  initScroll();
  filter();
  initProfitsSwiper();
  AOS.init();
  initStrapi();

  function initStrapi() {
    fetch("http://localhost:1337/api/works?populate=*")
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
          const workData = work; // в твоих данных всё уже на верхнем уровне
          const title = workData.title || "Без названия";
          const description = workData.description || "";
          const link = workData.link || "#";
          const tag = workData.tag || "Проект";

          // ✅ Поправлено: image — сразу объект
          const imageUrl = workData.image?.url
            ? `http://localhost:1337${workData.image.url}`
            : "./assets/img/projects-img.png";

          const task = workData.task || "";
          const solution = workData.solution || "";
          const structure = workData.structure || [];
          const result = workData.result || "";
          const behanceLink = workData.behanceLink || "#";

          // Создание карточки
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

  function initScroll() {
    window.addEventListener("scroll", (e) => {
      if (pageYOffset > 70) {
        $("header").addClass("js-scroll");
      } else {
        $("header").removeClass("js-scroll");
      }
    });
  }

  function initCustomSelect() {
    $("select").select2({
      width: "100%",
    });
  }

  function initFancy() {
    Fancybox.bind("[data-fancybox]", {
      // Your custom options
    });
    Fancybox.defaults.autoFocus = false;
  }

  function initMaskTel() {
    // Маска для телефона
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

  function initMobileBurger() {
    const hamMenu = document.querySelector(".header-ham-menu");
    const hamMenuSpan = document.querySelectorAll(".header-ham-menu span");
    const navMenuMob = document.querySelector(".header-nav-menu-mob");
    const body = document.querySelector("body");
    const tel = document.querySelectorAll(".header-tel");
    const logo = document.querySelector(".header-logo");
    const main = document.querySelector("main");
    const headerBorderMob = document.querySelector(".header-nav-box");
    const headerBox = document.querySelector(".header-box");
    const nameTheme = document.querySelector(".header-logo").dataset.theme;

    hamMenu.addEventListener("click", function () {
      hamMenu.classList.toggle("active");
      navMenuMob.classList.toggle("active");
      main.classList.toggle("blur");
      body.classList.toggle("overflow");
      // headerBorderMob.classList.toggle('js-border-none')
      tel.forEach(function (item) {
        item.classList.toggle("black");
      });
      if (hamMenu.classList.contains("active")) {
        // logo.setAttribute('src', `../themes/${nameTheme}/assets/img/svg/logo-black.svg`)
        logo.setAttribute("src", `./assets/img/svg/logo-black.svg`);
        headerBox.style.setProperty("background", "#fff");

        headerBorderMob.style.setProperty("border-bottom-color", "#000");
      } else {
        // logo.setAttribute('src', `../themes/${nameTheme}/assets/img/svg/logo.svg`)
        logo.setAttribute("src", `./assets/img/svg/logo.svg`);
        headerBox.style.setProperty("background", "none");
        headerBorderMob.style.setProperty(
          "border-bottom-color",
          "rgba(246, 246, 246, 0.6)"
        );
      }
    });

    main.addEventListener("click", function () {
      hamMenu.classList.remove("active");
      navMenuMob.classList.remove("active");
      main.classList.remove("blur");
      body.classList.remove("overflow");
      tel.forEach(function (item) {
        item.classList.remove("black");
      });
      // logo.setAttribute('src', `../themes/${nameTheme}/assets/img/svg/logo.svg`)
      logo.setAttribute("src", `./assets/img/svg/logo.svg`);
      headerBox.style.setProperty("background", "none");
      headerBorderMob.style.setProperty(
        "border-bottom-color",
        "rgba(246, 246, 246, 0.6)"
      );
    });

    const li = document.querySelectorAll(".js-nav-link");

    li.forEach(function (item) {
      item.addEventListener("click", function () {
        hamMenu.classList.toggle("active");
        navMenuMob.classList.toggle("active");
        main.classList.remove("blur");
        body.classList.toggle("overflow");
        // tel.classList.toggle('black')
        tel.forEach(function (item) {
          item.classList.remove("black");
        });
        // logo.setAttribute('src', `../themes/${nameTheme}/assets/img/svg/logo.svg`)
        logo.setAttribute("src", `./assets/img/svg/logo.svg`);
        headerBox.style.setProperty("background", "none");
        headerBorderMob.style.setProperty(
          "border-bottom-color",
          "rgba(246, 246, 246, 0.6)"
        );
      });
    });
  }

  function initClicks() {
    const header = document.querySelector(".header");
    const headerModelMenu = document.querySelectorAll(".js-header-sub-menu");

    document.addEventListener("click", (event) => {
      if (event.target.closest(".header-menu__nav-link")) {
        header.classList.remove("active");
      }
      if (event.target.closest(".js-header-sub-menu")) {
        event.preventDefault();
        headerModelMenu.forEach((item) => {
          item.classList.toggle("active");
        });
      }
    });
  }

  function initEquip() {
    const equipCard = document.querySelectorAll(".equip-card");

    for (let i = 0; i < 3; i++) {
      equipCard[i].classList.remove("showmore-hide");
      if (i == 0) {
      }
    }

    const equipCardArrow = document.querySelectorAll(".js_toggle_equip");

    equipCardArrow.forEach((arrow) => {
      arrow.addEventListener("click", function (item) {
        let equipCardInfo = arrow.closest(".equip-card-wrapper").nextElementSibling;
        let equipCardOuterBtn = arrow.closest(".equip-card").lastElementChild;
        let equipSpecsBox = document.querySelectorAll(".equip-specs-wrapper");
        equipCardInfo.classList.toggle("flex");
        equipCardOuterBtn.classList.toggle("mob-hide");
        if (equipCardInfo.classList.contains("flex")) {
          arrow.closest(".equip-card").style.setProperty("background", "#F6F6F6");
          arrow.style.setProperty("transform", "rotate(180deg)");
          equipSpecsBox.forEach(function (box) {
            box.style.setProperty("border-bottom", "none");
          });
        } else {
          arrow.closest(".equip-card").style.setProperty("background", "#fff");
          arrow.style.setProperty("transform", "rotate(0deg)");
          equipSpecsBox.forEach(function (box) {
            box.style.setProperty("border-bottom", "inherit");
          });
        }
      });
    });
  }

  function initColorChange() {
    const cards = document.querySelectorAll(".models-card");

    if (cards.length == 0) return;

    cards.forEach((card) => {
      const colors = card.querySelectorAll(".color");
      const imgs = card.querySelectorAll(".swiper-wrapper img");

      colors.forEach((color, idx) => {
        color.addEventListener("click", () => {
          const activeColor = card.querySelector(".color.active");
          const activeImg = card.querySelector(".swiper-wrapper img.active");
          const colorParam = window.getComputedStyle(color);

          activeColor && activeColor.classList.remove("active");
          activeImg && activeImg.classList.remove("active");
          activeColor && activeColor.classList.remove("active-black");

          color.classList.add("active");
          imgs[idx].classList.add("active");
          console.log(colorParam.getPropertyValue("background-color"));
          if (colorParam.getPropertyValue("background-color") === "rgb(255, 255, 255)") {
            // activeColor.style.setProperty('background', `url(../themes/${nameTheme}/assets/img/svg/mark-black.svg)`)
            color.classList.add("active-black");
          } else {
            // activeColor.style.setProperty('background', `url(../themes/${nameTheme}/assets/img/svg/mark.svg)`)
            color.classList.remove("active-black");
          }
        });
      });
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

  function initInstockSwiper() {
    var swiper = new Swiper(".instock-swiper", {
      direction: "vertical",
      slidesPerView: 1,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        // renderBullet: function (index, className) {
        //   return '<div class="' + className + '" style="background-image: url(./assets/img/'+ index +'.png)">' + "</div>";
        // },
      },
    });
  }

  function initSelects() {
    new SlimSelect({
      select: "#selectModel",
      settings: {
        placeholderText: "Выберите модель",
      },
    });
    new SlimSelect({
      select: "#selectEquip",
      settings: {
        placeholderText: "Выберите комплектацию",
      },
    });
    new SlimSelect({
      select: "#selectSort",
      settings: {
        placeholderText: "Сортировка по цене",
      },
    });
  }

  function initNouislider() {
    var slider1 = document.getElementById("calc-range");
    const slider1Value = document.getElementById("calc-range-value");

    noUiSlider.create(slider1, {
      start: 40,
      step: 10,
      behaviour: "snap",
      connect: [true, false],
      range: {
        min: 0,
        max: 100,
      },
    });

    slider1.noUiSlider.on("update", function (values) {
      let number = parseFloat(values[0].replace(".00", ""));
      slider1Value.innerHTML = number + " %";
    });
    var slider2 = document.getElementById("calc-range2");
    const slider2Value = document.getElementById("calc-range-value2");

    noUiSlider.create(slider2, {
      start: 40,
      step: 1,
      behaviour: "snap",
      connect: [true, false],
      range: {
        min: 6,
        max: 84,
      },
    });

    slider2.noUiSlider.on("update", function (values) {
      let number = parseFloat(values[0].replace(".00", ""));
      slider2Value.innerHTML = number + " мес.";
    });
  }

  function filter() {
    const filterButtons = document.querySelectorAll(".projects__tabs-item");
    const loadMoreBtn = document.querySelector(".projects__showmore");

    let visibleItems = 6;
    let currentFilter = "all";

    // Убираем пробелы, слэши и дефисы, приводим к нижнему регистру
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
    let visibleItems = 6; // Показываем первые 6 проектов
    let currentFilter = "all";

    // Инициализация (первая загрузка)
    function initPortfolio() {
      // 1. Прячем лишние проекты (все, что > 6)
      portfolioItems.forEach((item, index) => {
        if (index >= visibleItems) {
          item.classList.add("hidden-initially");
        }
      });

      // 2. Проверяем, нужна ли кнопка "Показать ещё"
      updateLoadMoreButton();
    }

    // Обновление состояния кнопки "Показать ещё"
    function updateLoadMoreButton() {
      // Считаем ТОЛЬКО проекты текущего фильтра (не скрытые)
      const visibleItemsInFilter = Array.from(portfolioItems).filter((item) => {
        const isVisible =
          !item.classList.contains("hide") &&
          !item.classList.contains("hidden-initially");
        const matchesFilter =
          currentFilter === "all" || item.dataset.category === currentFilter;
        return isVisible && matchesFilter;
      }).length;

      // Общее количество проектов в текущем фильтре (включая скрытые)
      const totalInFilter = Array.from(portfolioItems).filter((item) => {
        return currentFilter === "all" || item.dataset.category === currentFilter;
      }).length;

      // Показываем кнопку только если есть что грузить
      loadMoreBtn.style.display = visibleItemsInFilter < totalInFilter ? "block" : "none";
      console.log(`Видимых: ${visibleItemsInFilter}, Всего: ${totalInFilter}`);
    }

    // Фильтрация проектов
    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // 1. Обновляем активную кнопку фильтра
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");
        currentFilter = this.dataset.filter;

        // 2. Сбрасываем видимые проекты до 6
        visibleItems = 6;

        // 3. Применяем фильтр и обновляем отображение
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

        visibleItems = 6; // Сбрасываем счётчик
        // 4. Обновляем кнопку
        updateLoadMoreButton();
      });
    });

    // Кнопка "Показать ещё"
    loadMoreBtn.addEventListener("click", function () {
      visibleItems += 6; // Увеличиваем лимит

      // Показываем дополнительные проекты
      portfolioItems.forEach((item, index) => {
        const matchesFilter =
          currentFilter === "all" || item.dataset.category === currentFilter;
        if (matchesFilter && index < visibleItems) {
          item.classList.remove("hidden-initially");
        }
      });

      // Обновляем кнопку
      updateLoadMoreButton();
    });

    // Запускаем инициализацию
    initPortfolio();
  }
});
