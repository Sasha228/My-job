$(function() {


    window.notes = [];     

    var Note = function(title,text){
        this.title = title;
        this.text = text || '';
        this.date = new Date();
    }
        Note.prototype.getID = function(){
            return this.date.valueOf();
    }                                    
    Note.prototype.getShortText = function(){
        if (this.text.length > 20) {
            return this.text.substr(0,20) + '...';

        }else{
            return this.text;
        }
    };                                                         //где хранится массив данных //искать в консоле notes

    $('.add-note').on('click', function(){                                                                               //открывает модальное окно(МО)
        showModal('add');
    });


    var $modal = $('.modal');                                                                                            //модальное окно
    $modal.modal({
        show:false
    }).draggable();                                                                                                      //перемешение по окне


    var showModal = function(name){                                                                                      //изготовление массива
        var $template = $('[data-popup=' + name +']');
        $modal.find('.modal-title').text($template.attr('data-title'));                                                  //$template.data('title') второй вариант
        $modal.find('.modal-body').html($template.html());
        $modal.modal('show');
        window[name]($modal);                                                                                            //надо спросить - ? скорее всего, открывает массив
    };

    var onNoteChange = function(e){
       
       // $('.select-all').prop('checked', $('.notes .select-note:checked').length);                      // 1 variant

        $('.select-all').prop('checked', $('.notes .select-note').is(':checked'));                           ////Главный чекбокс // 2 variant


        /*
        var len = $('.notes .select-note').filter(':checked').length;                                       /// 3 variant
        console.log(len);
        if (len > 0) {
            $('.select-all').prop('checked',true);
        } else {
            $('.select-all').prop('checked',false);
        }
        */
var checked = this.checked
var $panel = $(this).parents('.panel');
$panel.toggleClass('panel-primary',!checked).toggleClass('panel-warning',checked);

    };

    var renderNote = function(note){                                                                                     //берет данные с массива добавляет заметку в блок
        var html = $('[data-tpl=note]').html();                                                                          //получает весь html верстку с этого объекта
        var $note = $(html);
        $note.attr('data-id', note.date.valueOf());                                                                      //дает уникальный id к заметку по дата и времени
        $note.find('.title').text(note.title);                                                                           //получает данные с массива и добавляет заголовок заметки
        $note.find('.descr').text(note.text);  
        $note.find('.descr').attr('title', note.text);                                                                           //получает данные с массива и добавляет описание заметки
        $('.notes').append($note);                                                                                       //добавляет каждый раз готовую заметку в див где <h1>-нет заметок
        $('.goOut').addClass('hidden');                                                                                  //при добавление заметки убирает <h1>-нет заметок
        $note.find('.select-note').on('change',onNoteChange);
        $note.on('click',function(e){
            showModal('edit');
        });
        $note.find('.select-note').on('click',function(e){                                                                 ////останавливает действие клика на указаном класе, атребете
            e.stopPropagation();
        })
    };


    window.add = function($modal){                                                                                       //добавление к массиву данные
        $modal.find('.add').on('click', function(){
            var title = $modal.find('[name=title]').val();                                                               //получение заголовка с модалного окна(МО)
            var note = $modal.find('[name=note]').val();                                                                 //получение текст описаании с модалного окна(МО)
            if(!title || !note){
                if(!title){                                                                                              //проверка на не пустую строку
                    $modal.find('[name=title]').parent().addClass('has-error');
                    setTimeout(function(){$modal.find('[name=title]').parent().removeClass('has-error');},3000);
                }
                if(!note){                                                                                               //проверка на не пустую строку
                    $modal.find('[name=note]').parent().addClass('has-error');
                    setTimeout(function(){$modal.find('[name=note]').parent().removeClass('has-error');},3000);
                }
            } else {
                var zapiska = new Note(title,note);
                window.notes.push(zapiska);
                renderNote(zapiska);
                ///var n = window.notes.push({                                                                              //манипуляционное добавление данных к массиву с МО
                 //   title:title,
                 //   note:note,
                  //  date:new Date();
                                                                                          //добавление самого блока с данными
                $modal.modal('hide');                                                                                       //закрытие МО
                $('.select-all').removeAttr('disabled');
            }
        });
    };

    $('.clear-note').on('click', function(){                                                                             //активизация кнопку delete
        $(".notes .select-note:checked").each(function(){
            var $panel = $(this).parents('.panel');
            var id = $panel.data('id');
            $panel.remove();
            window.notes.forEach(function(n,i){
                if(n.date.valueOf()===id)notes.splice(i,1);
                if(window.notes.length === 0){
                    $('.select-all').attr('disabled','true');
                     $('.select-all').prop('checked',false);
                     $('.goOut').removeClass('hidden');
                }
             });
         });
     });                                                   //получаем checked input в блоке и даем ему класс hidden

    $('.search').on('keyup', function(n){                                                                                //искать блок совпадаюзим запросом на поле поиск
        var $notes = $('[data-id]').removeClass('hidden');                                                               //создаем переменного с ID и удаяем класс hidden
        var str = $(this).val();                                                                                         //получаем текст запроса//получаем количество общых блоков
        window.notes.forEach(function(n){                                                                                //делаем проверку на не совподение
            if (n.title.search(str) === -1 && n.text.search(str) === -1) {
                $notes.filter('[data-id = ' + n.date.valueOf() + ']').addClass('hidden');                                //filter - мега функция как Никита говорил :)) скрывает все и выдает нужные поля
            }                                                                                                            ///и тут мы добавили класс hidden каждому не совпадающему блоку с текстом запроса
        });
        var a = $notes.length;
        var b = $notes.filter('.hidden').length;                                                                         //получаем количество скрытых блоков
        if (a === b && a > 0){                                                                                                    //делаем проверку а и б, если ровное количество у обоих, то
            $('.empty-search').removeClass('hidden');                                                                    ///убираем класс с h1 и отобразим "нет совпадений"
        } else {
            $('.empty-search').addClass('hidden');                                                                       //в случаи удаление запроса скрывает h1 "нет совпадений"

        }
    });


    $('.select-all').on('change',function(e){                                      // change  событие при авыбранной галочке
        console.log($(this).is(':checked'));                                        // this выберет из всех чекбоксов отмеченый, is  провереяет чекнутый он или нет

        $('.notes .select-note').prop('checked',this.checked).trigger('change');                      // первый вариант
       
        /*
        var checked = this.checked;                                                 // второй вариант
        if(checked){
            $('.notes').find('.select-note').prop('checked',true);                  // prop это как attr только лучше добавляет
        } else {
            $('.notes').find('.select-note').prop('checked',false)
        }
        */

    });
























});