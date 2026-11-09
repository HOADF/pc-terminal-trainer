// Справочник команд Windows CMD — данные для тренажёра терминала.
// Вывод в примерах приблизительный (как в реальной Windows), а не "живой" —
// тренажёр ничего не выполняет на настоящей системе, это обучающая симуляция.

const COMMAND_CATEGORIES = [
    {
        id: "files",
        title: "Файлы и папки",
        commands: [
            {
                name: "dir",
                syntax: "dir [путь] [/p] [/w] [/s]",
                description: "Показывает список файлов и папок в текущей директории.",
                example: "dir",
                output:
` Том в устройстве C не имеет метки.
 Серийный номер тома: 1A2B-3C4D

 Содержимое папки C:\\Users\\Guest

09.11.2026  08:12    <DIR>          Documents
09.11.2026  08:12    <DIR>          Downloads
08.11.2026  21:45             1 024 notes.txt
               1 файлов          1 024 байт
               2 папок   42 103 582 720 байт свободно`
            },
            {
                name: "cd",
                syntax: "cd [путь]  (или chdir)",
                description: "Переходит в указанную папку или показывает текущую.",
                example: "cd Documents",
                output: `C:\\Users\\Guest\\Documents>`
            },
            {
                name: "md",
                syntax: "md имя_папки  (или mkdir)",
                description: "Создаёт новую папку.",
                example: "md Projects",
                output: `(папка "Projects" создана, вывода в консоли нет)`
            },
            {
                name: "rd",
                syntax: "rd имя_папки  (или rmdir, с /s для непустой папки)",
                description: "Удаляет папку. Пустую — сразу, непустую — только с ключом /s.",
                example: "rd /s Projects",
                output:
`Папка Projects, все вложенные файлы? [Y/N]? y`
            },
            {
                name: "del",
                syntax: "del имя_файла  (или erase)",
                description: "Удаляет один или несколько файлов.",
                example: "del notes.txt",
                output: `(файл удалён, вывода в консоли нет)`
            },
            {
                name: "copy",
                syntax: "copy источник назначение",
                description: "Копирует один или несколько файлов.",
                example: "copy notes.txt backup.txt",
                output: `        1 файл скопирован.`
            },
            {
                name: "move",
                syntax: "move источник назначение",
                description: "Перемещает файлы или переименовывает папку.",
                example: "move notes.txt Documents\\notes.txt",
                output: `        1 файл перемещен.`
            },
            {
                name: "ren",
                syntax: "ren старое_имя новое_имя  (или rename)",
                description: "Переименовывает файл или папку.",
                example: "ren notes.txt todo.txt",
                output: `(переименовано, вывода в консоли нет)`
            },
            {
                name: "type",
                syntax: "type имя_файла",
                description: "Выводит содержимое текстового файла на экран.",
                example: "type notes.txt",
                output: `Купить корм коту. Позвонить в банк.`
            },
            {
                name: "tree",
                syntax: "tree [путь] [/f]",
                description: "Показывает дерево папок (и файлов с ключом /f).",
                example: "tree /f",
                output:
`Структура папок тома C
C:.
├───Documents
│       notes.txt
└───Downloads`
            },
            {
                name: "attrib",
                syntax: "attrib [+r|-r] [+h|-h] имя_файла",
                description: "Показывает или меняет атрибуты файла (только чтение, скрытый и т.д.).",
                example: "attrib +r notes.txt",
                output: `(файлу установлен атрибут «только чтение»)`
            },
            {
                name: "xcopy",
                syntax: "xcopy источник назначение /e /i",
                description: "Копирует файлы и папки целиком, включая вложенные подпапки.",
                example: "xcopy Documents D:\\Backup /e /i",
                output: `Скопировано файлов:         3`
            },
            {
                name: "find",
                syntax: `find "текст" имя_файла`,
                description: "Ищет строку с заданным текстом внутри файла.",
                example: `find "кот" notes.txt`,
                output:
`---------- NOTES.TXT
Купить корм коту.`
            },
            {
                name: "findstr",
                syntax: `findstr "шаблон" имя_файла`,
                description: "Ищет текст по шаблону (мощнее find, понимает регулярные выражения).",
                example: `findstr /i "banк" notes.txt`,
                output: `Позвонить в банк.`
            }
        ]
    },
    {
        id: "system",
        title: "Система",
        commands: [
            {
                name: "systeminfo",
                syntax: "systeminfo",
                description: "Выводит подробную информацию об операционной системе и оборудовании.",
                example: "systeminfo",
                output:
`Имя узла:                  HOADF-PC
Имя ОС:                    Microsoft Windows 11 Pro
Версия ОС:                 10.0.26100
Изготовитель ОС:           Microsoft Corporation
Объем физической памяти:   16 338 МБ`
            },
            {
                name: "whoami",
                syntax: "whoami",
                description: "Показывает имя текущего пользователя.",
                example: "whoami",
                output: `hoadf-pc\\guest`
            },
            {
                name: "ver",
                syntax: "ver",
                description: "Показывает версию операционной системы.",
                example: "ver",
                output: `Microsoft Windows [Версия 10.0.26100.1000]`
            },
            {
                name: "hostname",
                syntax: "hostname",
                description: "Показывает сетевое имя компьютера.",
                example: "hostname",
                output: `HOADF-PC`
            },
            {
                name: "tasklist",
                syntax: "tasklist",
                description: "Показывает список запущенных процессов.",
                example: "tasklist",
                output:
`Имя образа                    PID   Имя сессии
========================= ======== ============
System Idle Process              0  Services
explorer.exe                   4312  Console
chrome.exe                     7788  Console`
            },
            {
                name: "taskkill",
                syntax: "taskkill /im имя_процесса /f  (или /pid номер)",
                description: "Принудительно завершает процесс по имени или PID.",
                example: "taskkill /im chrome.exe /f",
                output: `УСПЕХ: Процесс "chrome.exe" с кодом PID 7788 был завершен.`
            },
            {
                name: "shutdown",
                syntax: "shutdown /s /t 60  (или /r — перезагрузка, /a — отмена)",
                description: "Выключает или перезагружает компьютер через указанное время (в секундах).",
                example: "shutdown /s /t 60",
                output: `Завершение работы компьютера HOADF-PC через 1 минуту.`
            },
            {
                name: "chkdsk",
                syntax: "chkdsk [диск:] [/f]",
                description: "Проверяет диск на ошибки файловой системы.",
                example: "chkdsk C:",
                output: `Проверка завершена. Windows обнаружила ошибок файловой системы: 0.`
            },
            {
                name: "sfc",
                syntax: "sfc /scannow",
                description: "Проверяет и восстанавливает системные файлы Windows.",
                example: "sfc /scannow",
                output: `Защита ресурсов Windows не обнаружила нарушений целостности.`
            },
            {
                name: "driverquery",
                syntax: "driverquery",
                description: "Показывает список установленных драйверов устройств.",
                example: "driverquery",
                output:
`Имя модуля  Имя отображения              Тип драйвера
=========== ============================ ============
1394ohci    1394 OHCI Compliant...       Kernel`
            },
            {
                name: "set",
                syntax: "set [имя=значение]",
                description: "Показывает или задаёт переменные окружения.",
                example: "set",
                output:
`COMPUTERNAME=HOADF-PC
OS=Windows_NT
PATH=C:\\Windows\\system32;C:\\Windows`
            },
            {
                name: "cls",
                syntax: "cls",
                description: "Очищает экран терминала.",
                example: "cls",
                output: "__CLEAR__"
            }
        ]
    },
    {
        id: "network",
        title: "Сеть",
        commands: [
            {
                name: "ipconfig",
                syntax: "ipconfig [/all]",
                description: "Показывает сетевые настройки компьютера (IP-адрес, шлюз и т.д.).",
                example: "ipconfig",
                output:
`Адаптер Ethernet:
   IPv4-адрес. . . . . . . . . . . : 192.168.1.42
   Маска подсети . . . . . . . . . : 255.255.255.0
   Основной шлюз . . . . . . . . . : 192.168.1.1`
            },
            {
                name: "ping",
                syntax: "ping адрес",
                description: "Проверяет доступность узла в сети и время отклика.",
                example: "ping github.com",
                output:
`Обмен пакетами с github.com [140.82.121.4] по 32 байт:
Ответ от 140.82.121.4: число байт=32 время=24мс TTL=56
Ответ от 140.82.121.4: число байт=32 время=23мс TTL=56

Статистика Ping для 140.82.121.4:
    Пакетов: отправлено = 4, получено = 4, потеряно = 0 (0% потерь)`
            },
            {
                name: "tracert",
                syntax: "tracert адрес",
                description: "Показывает маршрут пакетов до узла, через какие узлы проходит запрос.",
                example: "tracert github.com",
                output:
`Трассировка маршрута к github.com [140.82.121.4]
  1    1 ms    <1 мс    <1 мс  192.168.1.1
  2    8 ms     9 мс     8 мс  10.10.0.1
  3   24 ms    23 мс    24 мс  140.82.121.4`
            },
            {
                name: "netstat",
                syntax: "netstat [-a] [-n]",
                description: "Показывает активные сетевые подключения и открытые порты.",
                example: "netstat -an",
                output:
`  Протокол  Локальный адрес        Состояние
  TCP       0.0.0.0:445            LISTENING
  TCP       192.168.1.42:51230     ESTABLISHED`
            },
            {
                name: "nslookup",
                syntax: "nslookup домен",
                description: "Узнаёт IP-адрес по доменному имени через DNS.",
                example: "nslookup github.com",
                output:
`Сервер:  dns.google
Адрес:  8.8.8.8

Неавторитетный ответ:
Имя:    github.com
Адрес:  140.82.121.4`
            },
            {
                name: "getmac",
                syntax: "getmac",
                description: "Показывает MAC-адреса сетевых адаптеров компьютера.",
                example: "getmac",
                output:
`Физический адрес      Транспортное имя
===================== ==========================================
A4-C3-F0-85-AC-2D      \\Device\\Tcpip_{...}`
            }
        ]
    },
    {
        id: "misc",
        title: "Прочее",
        commands: [
            {
                name: "echo",
                syntax: "echo текст",
                description: "Выводит текст на экран (часто используется в .bat-скриптах).",
                example: "echo Привет, мир!",
                output: `Привет, мир!`
            },
            {
                name: "color",
                syntax: "color [код]  (например, 0a)",
                description: "Меняет цвет текста и фона окна консоли.",
                example: "color 0a",
                output: `(цвет консоли изменён, вывода в консоли нет)`
            },
            {
                name: "title",
                syntax: "title текст",
                description: "Меняет заголовок окна консоли.",
                example: "title Мой терминал",
                output: `(заголовок окна изменён, вывода в консоли нет)`
            },
            {
                name: "date",
                syntax: "date",
                description: "Показывает и позволяет изменить текущую дату системы.",
                example: "date",
                output: `Текущая дата: пн 09.11.2026`
            },
            {
                name: "time",
                syntax: "time",
                description: "Показывает и позволяет изменить текущее время системы.",
                example: "time",
                output: `Текущее время: 8:34:12,07`
            },
            {
                name: "exit",
                syntax: "exit",
                description: "Закрывает окно терминала.",
                example: "exit",
                output: `(в реальном CMD окно закрылось бы — здесь просто справочный пример)`
            }
        ]
    }
];

// Плоский список всех команд — удобно для автодополнения и поиска.
const ALL_COMMANDS = COMMAND_CATEGORIES.flatMap(cat =>
    cat.commands.map(cmd => ({ ...cmd, category: cat.title }))
);
