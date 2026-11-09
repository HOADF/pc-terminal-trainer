(function () {
    "use strict";

    const output = document.getElementById("terminal-output");
    const input = document.getElementById("terminal-input");
    const body = document.getElementById("terminal-body");
    const refList = document.getElementById("ref-list");
    const refPanel = document.getElementById("ref-panel");
    const toggleBtn = document.getElementById("toggle-panel");

    const history = [];
    let historyPos = -1;
    let currentSuggestEl = null;

    // ---------- Вывод строк в терминал ----------

    function appendLine(text, className) {
        const div = document.createElement("div");
        div.className = className || "line-output";
        div.textContent = text;
        output.appendChild(div);
    }

    function appendCommandEcho(cmdText) {
        const div = document.createElement("div");
        div.className = "line-cmd";
        const promptSpan = document.createElement("span");
        promptSpan.className = "prompt-echo";
        promptSpan.textContent = "C:\\Users\\Guest> ";
        div.appendChild(promptSpan);
        div.appendChild(document.createTextNode(cmdText));
        output.appendChild(div);
    }

    function scrollToBottom() {
        body.scrollTop = body.scrollHeight;
    }

    function clearSuggest() {
        if (currentSuggestEl) {
            currentSuggestEl.remove();
            currentSuggestEl = null;
        }
    }

    // ---------- Поиск команд ----------

    function findExact(name) {
        return ALL_COMMANDS.find(c => c.name === name);
    }

    function findMatches(prefix) {
        if (!prefix) return [];
        const p = prefix.toLowerCase();
        return ALL_COMMANDS.filter(c => c.name.startsWith(p));
    }

    function levenshtein(a, b) {
        const m = a.length, n = b.length;
        const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,
                    dp[i][j - 1] + 1,
                    dp[i - 1][j - 1] + cost
                );
            }
        }
        return dp[m][n];
    }

    function findClosest(name) {
        let best = null;
        let bestDist = Infinity;
        for (const c of ALL_COMMANDS) {
            const d = levenshtein(name, c.name);
            if (d < bestDist) {
                bestDist = d;
                best = c;
            }
        }
        return bestDist <= 2 ? best : null;
    }

    // ---------- Выполнение "команды" ----------

    function runCommand(raw) {
        const trimmed = raw.trim();
        if (!trimmed) return;

        appendCommandEcho(raw);
        clearSuggest();

        history.push(raw);
        historyPos = history.length;

        const firstWord = trimmed.split(/\s+/)[0].toLowerCase();

        if (firstWord === "help" || firstWord === "?") {
            showHelp();
            scrollToBottom();
            return;
        }

        if (firstWord === "clear" || firstWord === "cls") {
            output.innerHTML = "";
            appendLine('Экран очищен командой "' + firstWord + '".', "line-system");
            return;
        }

        const cmd = findExact(firstWord);

        if (cmd) {
            if (cmd.output === "__CLEAR__") {
                output.innerHTML = "";
                appendLine('Экран очищен командой "cls".', "line-system");
                return;
            }
            appendLine(cmd.output, "line-output");
        } else {
            appendLine(
                `"${firstWord}" не является внутренней или внешней командой, исполняемой программой или пакетным файлом.`,
                "line-error"
            );
            const close = findClosest(firstWord);
            if (close) {
                appendLine(`Возможно, вы имели в виду: ${close.name} — ${close.description}`, "line-hint");
            } else {
                appendLine(`Введите help, чтобы увидеть список всех доступных команд.`, "line-hint");
            }
        }

        scrollToBottom();
    }

    function showHelp() {
        appendLine("Доступные команды по категориям (вводите имя команды, чтобы увидеть пример результата):", "line-system");
        COMMAND_CATEGORIES.forEach(cat => {
            appendLine(`— ${cat.title} —`, "line-hint");
            const names = cat.commands.map(c => c.name).join(", ");
            appendLine(names, "line-output");
        });
    }

    // ---------- Автодополнение по вводу ----------

    function renderSuggestions(prefix) {
        clearSuggest();
        const matches = findMatches(prefix).slice(0, 8);
        if (matches.length === 0) return;

        const wrap = document.createElement("div");
        wrap.className = "suggest-list";
        matches.forEach(m => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "suggest-chip";
            chip.textContent = m.name;
            chip.addEventListener("click", () => {
                input.value = m.name + " ";
                input.focus();
                clearSuggest();
            });
            wrap.appendChild(chip);
        });
        output.appendChild(wrap);
        currentSuggestEl = wrap;
        scrollToBottom();
    }

    input.addEventListener("input", () => {
        const val = input.value.trim();
        if (val.length > 0) {
            renderSuggestions(val.split(/\s+/)[0]);
        } else {
            clearSuggest();
        }
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const val = input.value;
            input.value = "";
            runCommand(val);
        } else if (e.key === "Tab") {
            e.preventDefault();
            const prefix = input.value.trim();
            const matches = findMatches(prefix);
            if (matches.length >= 1) {
                input.value = matches[0].name + " ";
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (history.length === 0) return;
            historyPos = Math.max(0, historyPos - 1);
            input.value = history[historyPos] || "";
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (history.length === 0) return;
            historyPos = Math.min(history.length, historyPos + 1);
            input.value = history[historyPos] || "";
        }
    });

    // Кнопки-дублёры для мобильных (Tab/история/Enter без физической клавиатуры)
    document.querySelectorAll(".terminal-controls button").forEach(btn => {
        btn.addEventListener("click", () => {
            const action = btn.dataset.action;
            if (action === "enter") {
                const val = input.value;
                input.value = "";
                runCommand(val);
                input.focus();
            } else if (action === "tab") {
                input.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", cancelable: true }));
                input.focus();
            } else if (action === "up") {
                input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", cancelable: true }));
                input.focus();
            } else if (action === "down") {
                input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", cancelable: true }));
                input.focus();
            }
        });
    });

    // ---------- Боковой справочник ----------

    function buildRefPanel() {
        COMMAND_CATEGORIES.forEach(cat => {
            const block = document.createElement("div");
            block.className = "ref-category";

            const h3 = document.createElement("h3");
            h3.textContent = cat.title;
            block.appendChild(h3);

            cat.commands.forEach(cmd => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "ref-cmd";
                btn.innerHTML = `<b>${cmd.name}</b><span>${cmd.description}</span>`;
                btn.addEventListener("click", () => {
                    input.value = cmd.example;
                    input.focus();
                    if (window.innerWidth <= 860) {
                        refPanel.classList.remove("open");
                        toggleBtn.setAttribute("aria-expanded", "false");
                    }
                });
                block.appendChild(btn);
            });

            refList.appendChild(block);
        });
    }

    toggleBtn.addEventListener("click", () => {
        const isOpen = refPanel.classList.toggle("open");
        toggleBtn.setAttribute("aria-expanded", String(isOpen));
    });

    // ---------- Блокнот-справочник (широкие экраны) ----------

    const CATEGORY_COLORS = {
        files: "var(--cat-files)",
        system: "var(--cat-system)",
        network: "var(--cat-network)",
        misc: "var(--cat-misc)"
    };

    const CATEGORY_ICONS = {
        files: "📁",
        system: "🖥",
        network: "🌐",
        misc: "⚙"
    };

    const CATEGORY_SHORT = {
        files: "Файлы",
        system: "Система",
        network: "Сеть",
        misc: "Прочее"
    };

    const notebook = document.getElementById("notebook");
    const notebookCover = document.getElementById("notebook-cover");
    const notebookPages = document.getElementById("notebook-pages");
    const notebookPageLeft = document.querySelector(".notebook-page-left");
    const notebookPageIcon = document.getElementById("notebook-page-icon");
    const notebookPageTitle = document.getElementById("notebook-page-title");
    const notebookPageRight = document.getElementById("notebook-page-right");
    const notebookTabsWrap = document.getElementById("notebook-tabs");
    const notebookCloseBtn = document.getElementById("notebook-close");

    let notebookOpen = false;
    let notebookActiveIndex = null;
    let notebookTabs = [];

    function fillCommandList(container, cat) {
        container.innerHTML = "";
        cat.commands.forEach(cmd => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "notebook-cmd";
            btn.innerHTML = `<b>${cmd.name}</b><span>${cmd.description}</span>`;
            btn.addEventListener("click", () => {
                input.value = cmd.example;
                input.focus();
            });
            container.appendChild(btn);
        });
    }

    function renderNotebookPage(index) {
        const cat = COMMAND_CATEGORIES[index];
        notebookPageIcon.textContent = CATEGORY_ICONS[cat.id] || "📄";
        notebookPageTitle.textContent = cat.title;
        notebookPageLeft.style.setProperty("--active-cat-color", CATEGORY_COLORS[cat.id] || "var(--accent)");
        notebookPageRight.style.setProperty("--active-cat-color", CATEGORY_COLORS[cat.id] || "var(--accent)");
        fillCommandList(notebookPageRight, cat);
    }

    function updateTabPositions() {
        notebookTabs.forEach((tab, i) => {
            const isActiveLeft = notebookOpen && notebookActiveIndex === i;
            tab.classList.toggle("pos-left", isActiveLeft);
            tab.classList.toggle("pos-right", !isActiveLeft);
            tab.classList.toggle("active", notebookOpen && notebookActiveIndex === i);
            tab.setAttribute("aria-pressed", String(notebookOpen && notebookActiveIndex === i));
        });
    }

    function buildNotebookTabs() {
        COMMAND_CATEGORIES.forEach((cat, i) => {
            const tab = document.createElement("button");
            tab.type = "button";
            tab.className = "notebook-tab pos-right";
            tab.style.setProperty("--tab-color", CATEGORY_COLORS[cat.id] || "var(--accent)");
            tab.style.top = (18 + i * 54) + "px";
            tab.textContent = CATEGORY_SHORT[cat.id] || cat.title;
            tab.title = cat.title + ": " + cat.commands.map(c => c.name).join(", ");
            tab.setAttribute("aria-pressed", "false");
            tab.addEventListener("click", () => selectNotebookCategory(i));
            notebookTabsWrap.appendChild(tab);
            notebookTabs.push(tab);
        });
    }

    function selectNotebookCategory(i) {
        if (!notebookOpen) {
            notebookOpen = true;
            notebook.classList.add("open");
            notebookActiveIndex = i;
            renderNotebookPage(i);
            updateTabPositions();
            return;
        }

        if (notebookActiveIndex === i) {
            // повторный клик по открытой вкладке — закрываем блокнот обратно на обложку
            notebookOpen = false;
            notebook.classList.remove("open");
            notebookActiveIndex = null;
            updateTabPositions();
            return;
        }

        // переключение на другую категорию — анимация переворота страницы
        const dir = i > notebookActiveIndex ? "flipping-fwd" : "flipping-back";
        notebookPageRight.classList.remove("flipping-fwd", "flipping-back");
        void notebookPageRight.offsetWidth;
        notebookPageRight.classList.add(dir);

        setTimeout(() => {
            notebookActiveIndex = i;
            renderNotebookPage(i);
            updateTabPositions();
        }, 220);

        notebookPageRight.addEventListener("animationend", function onEnd() {
            notebookPageRight.classList.remove("flipping-fwd", "flipping-back");
            notebookPageRight.removeEventListener("animationend", onEnd);
        });
    }

    notebookCloseBtn.addEventListener("click", () => {
        notebookOpen = false;
        notebook.classList.remove("open");
        notebookActiveIndex = null;
        updateTabPositions();
    });

    buildNotebookTabs();
    if (COMMAND_CATEGORIES.length > 0) {
        renderNotebookPage(0); // чтобы обложка-заглушка внутри страниц не была пустой при первом открытии
    }

    // ---------- Приветствие ----------

    function showWelcome() {
        appendLine("Microsoft Windows [Версия 10.0.26100.1000]", "line-system");
        appendLine("(c) Корпорация Майкрософт. Все права защищены.", "line-system");
        appendLine("", "line-output");
        appendLine("Это тренажёр команд Windows (CMD) — учебная симуляция, команды не выполняются на реальном компьютере.", "line-hint");
        appendLine('Введите "help", чтобы увидеть список всех команд, или откройте справочник сбоку.', "line-hint");
        appendLine("", "line-output");
    }

    // ---------- Корпус монитора: включение и загрузка ----------

    const crtMonitor = document.getElementById("crt-monitor");
    const crtFlash = document.getElementById("crt-flash");
    const powerBtn = document.getElementById("power-btn");
    const powerBtnOverlay = document.getElementById("power-btn-overlay");

    const BOOT_LINES = [
        "HOADF BIOS v2.6 — Copyright (C) HOADF",
        "Проверка видеопамяти... OK",
        "Проверка оперативной памяти: 640K OK",
        "Обнаружен накопитель: C:\\ OK",
        "Загрузка HOADF Terminal...",
    ];

    let isOn = false;
    let isBusy = false;

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Печатает строку посимвольно, как в старом BIOS, и ждёт паузу после неё
    function typeBootLine(text, className, pauseAfter) {
        return new Promise(resolve => {
            const div = document.createElement("div");
            div.className = className || "line-system";
            output.appendChild(div);

            let i = 0;
            const charDelay = 16;

            function step() {
                div.textContent = text.slice(0, i);
                scrollToBottom();
                if (i < text.length) {
                    i++;
                    setTimeout(step, charDelay);
                } else {
                    setTimeout(resolve, pauseAfter);
                }
            }
            step();
        });
    }

    async function runBootSequence() {
        output.innerHTML = "";
        await wait(650); // монитор "прогревается" перед первой строкой
        for (const line of BOOT_LINES) {
            await typeBootLine(line, "line-system", 480);
        }
        await wait(700);
        output.innerHTML = "";
        showWelcome();
        input.disabled = false;
        input.focus();
        isBusy = false;
    }

    function turnOn() {
        if (isOn || isBusy) return;
        isBusy = true;
        isOn = true;
        crtMonitor.classList.add("crt-on");
        crtMonitor.classList.remove("crt-off");
        powerBtn.setAttribute("aria-pressed", "true");
        crtFlash.classList.remove("playing");
        // форсируем перезапуск анимации
        void crtFlash.offsetWidth;
        crtFlash.classList.add("playing");
        runBootSequence();
    }

    function turnOff() {
        if (!isOn || isBusy) return;
        isOn = false;
        crtMonitor.classList.remove("crt-on");
        crtMonitor.classList.add("crt-off");
        powerBtn.setAttribute("aria-pressed", "false");
        crtFlash.classList.remove("playing");
        input.disabled = true;
        input.value = "";
        output.innerHTML = "";
        clearSuggest();
    }

    function togglePower() {
        if (isOn) {
            turnOff();
        } else {
            turnOn();
        }
    }

    powerBtn.addEventListener("click", togglePower);
    powerBtnOverlay.addEventListener("click", turnOn);

    buildRefPanel();
})();
