<p align="center">
  <img src="http://i.imgur.com/4blLPjP.png" alt="Løøps"/>
</p>

## Требования
* PHP с разрешенной функцией `exec`
* FFMpeg, скомпилированный библиотеками `libmp3lame` и `libvorbis`
* MySQL

## Установка

### Общие настройки (`common_config.php`)
* `CONFIG_ENVIRONMENT` — способ конфигурации (см. ниже)
* `MASTER_PASS` и `SALT` — пароль админа и соль для хэширования
* `LOOPS_DBNAME` и `LOOPS_DBNAME` — названия таблиц в базе данных
* `MAX_LOOP_LENGTH` и `MAX_LOOP_FSZKB` — ограничения на размер и длительность лупов
* `MP3_Q` и `OGG_Q` — качество кодирования лупов в другой формат (см. документацию ffmpeg)
* `NAME_TRUNC` — ограничение на длину имени лупов/паттернов
* `MAX_SIZE` — максимальный размер паттерна по одному из измерений
* $cell_styles — список доступных стилей. Список будет пополняться (возможно)

### Присосаться к конфигурации [Instant 0chan](https://github.com/Juribiyan/instant-0chan)
Если у вас установлен Instant 0chan, можно использовать его подключение к базе данных и прописанный в его конфиге `KU_FFMPEGPATH`. Для этого установите значение `CONFIG_ENVIRONMENT`=`"instant"` и пропишите путь к `config.php` инстанта.

### Самостоятельная конфигурация (`standalone_config.php`)
* `KU_FFMPEGPATH` — путь к FFMpeg. Определяется командой `which ffmpeg` или `where ffmpeg`
* `KU_DB...` — параметры подключения к базе данных

### Поставляемый контент
По умолчанию можно установить лупы и паттерны от ЕФГ, а также несколько екстра лупов и паттернов. Лупы не включены в репозиторий и могут быть скачаны [отсюда](https://disk.yandex.ru/d/Va_9wJITK0xxZw).

### Процесс установки
Скопируйте пак контента в `install/media/`.
Из папки `/lib/` выполните `composer install`.
В `common_config.php` заполните поле `SALT`, после чего получите хэш своего пароля по ссылке `/common_config.php?getpasswordhash=<your password>` и введите его в поле `MASTER_HASH`.
При запуске `install.php` будет осуществлена проверка наличия и работоспособности FFMpeg и подключения к БД. Если вы видите окно "Установка лупов!", то проверка прошла успешно. Выбирайте тип установленного контента и продолжайте.

**После установки нужно удалить `install.php`**. Можно также удалить всю папку `/install`.

### Обновление с версии 2.0 до версии 3.0
* Скопируйте файл `loops_migrate_to_v3.php` из папки `install/` в корневую директорию и запустите.
** Важно правильно выставить `KU_COLLATION` перед обновлением.

## Работа с лупами
Для получения доступа к административным функциям, введите "↑↑↓↓←→←→ba"

## Статическая версия
Для этой ветки кстатическая версия находится в разработке.
