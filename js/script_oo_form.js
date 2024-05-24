/*
function prepareInnKpp(input) {
    input = input.trim();
    input = input.replace(/ +(?= )/g,'');
    let parts = input.split(' ');
    let inn = parts[0];
    let kpp = parts[1];
    return inn.trim() + ' ' + kpp.trim();
}
*/

// Функция для проверки правильности ИНН
function is_valid_inn(input) {
    var parts = input.split(' ');
    var inn = parts[0];
    var kpp = parts[1];

    if (inn.length == 12)
    {
        const hasLeadingTrailingSpaces = input.trim() !== input;
        if (hasLeadingTrailingSpaces) {
            return [false, "Поле содержит лишние пробелы в начале или в конце строки." ];
        }
        return validateInn(inn);

    }

    const hasLeadingTrailingSpaces = input.trim() !== input;
    if (hasLeadingTrailingSpaces && kpp.length == 9) {
        return [false, "Поле содержит лишние пробелы в начале или в конце строки." ];
    }

    const extraSpaces = input.match(/\s\s+/g)
    if (extraSpaces) {
        return [false, "Содержит лишний пробел между ИНН и КПП" ];
    }

    if (validateInn(inn)[0] == true && validateKpp(kpp)[0] == false) {

        return validateKpp(kpp);
    }
    else if (validateInn(inn)[0] == false && validateKpp(kpp)[0] == true) {

        return validateInn(inn);
    }
    else if (validateInn(inn)[0] == false && validateKpp(kpp)[0] == false) {

        return validateInn(inn);
    }
    else {
        return [true, ' '];
    }

}

function validateInn(inn) {
    var result = false;
    if (typeof inn === 'number') {
        inn = inn.toString();
    } else if (typeof inn !== 'string') {
        inn = '';
    }
    if (!inn.length) {
        error = 'ИНН пуст или содержит пробел';
    } else if (/[^0-9]/.test(inn)) {
        error = 'ИНН может состоять только из цифр';
    } else if ([10, 12].indexOf(inn.length) === -1) {
        error = 'ИНН может состоять только из 10 или 12 цифр';
    } else {
        var checkDigit = function (inn, coefficients) {
            var n = 0;
            for (var i in coefficients) {
                n += coefficients[i] * inn[i];
            }
            return parseInt(n % 11 % 10);
        };
        switch (inn.length) {
            case 10:
                var n10 = checkDigit(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8]);
                if (n10 === parseInt(inn[9])) {
                    result = true;
                }
                break;
            case 12:
                var n11 = checkDigit(inn, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
                var n12 = checkDigit(inn, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
                if ((n11 === parseInt(inn[10])) && (n12 === parseInt(inn[11]))) {
                    result = true;
                }
                break;
        }
        if (!result) {
            error = 'Неправильное контрольное число, проверьте правильность ввода ИНН';
        }
    }
    if (result == false)
    {
        return [result, error];
    }
    else
    {
        return [result,' '];
    }
}

function validateKpp(kpp) {
    var result = false;
    if (typeof kpp === 'number') {
        kpp = kpp.toString();
    } else if (typeof kpp !== 'string') {
        kpp = '';
    }
    if (!kpp.length) {
        error = 'КПП пуст добавьте через пробел';
    } else if (kpp.length !== 9) {
        error = 'КПП может состоять только из 9 знаков (цифр или заглавных букв латинского алфавита от A до Z)';

    } else if (!/^[0-9]{4}[0-9A-Z]{2}[0-9]{3}$/.test(kpp)) {
        error = 'Неправильный формат КПП';
    } else {
        result = true;
    }
    if (result == false)
    {
        return [result, error];
    }
    else
    {
        return [result,' '];
    }
}



window.Parsley.addValidator('innKpp', {
    validateString: function(value, req, elem) {
        // We can add dynamic error message here.
        // window.Parsley.addMessage(lenguage, validatorName, customErrorMessage);

        let result = is_valid_inn(value)
        if (result[0]) {
            result[1] = '';
        } else {
        }
        window.Parsley.addMessage('ru', 'innKpp', result[1]);
        return result[0];
    }
});


window.Parsley.addValidator('amountNotZero', {
//    requirementType: 'integer',
    validateNumber: function(value, req, elem) {
        let result = false;
        if (value > 0) {
            result = true;
        } else {
            if ( $(req).val() > 0) {
                result = true;
            }
        }
        return result;
    },
    messages: {
        ru: 'Кол-во лицензий "Альт Образование" или "Альт Рабочая станция" не должно быть нулевым'
    }
});




// https://github.com/guillaumepotier/Parsley.js/issues/839


// https://stackoverflow.com/questions/45210215/how-to-get-parsley-js-to-validate-if-one-of-the-fields-has-number-with-a-with-a
// https://parsleyjs.org/doc/examples/custom-validator-events.html

$(window).on('load', function(){
    setTimeout(function () {


        var spans = document.querySelectorAll('span');
        spans.forEach(function(span) {
            if (span.textContent === "ИНН КПП ОО") {
                span.textContent = "ИНН и КПП образовательной организации";
            }
            if (span.textContent === "Тип ОО") {
                span.textContent = "Тип образовательной организации";
            }
            // if (span.textContent === "ФИО контактного лица") {
            //     span.textContent = "ФИО контактного лица ОО";
            // }
            if (span.textContent === "Телефон контактного лица ОО") {
                span.textContent = "Телефон контактного лица образовательной организации";
            }
            // if (span.textContent === "Email контактного лица") {
            //     span.textContent = "Email контактного лица ОО";
            // }
            if (span.textContent === "Email для оформления лицензий") {
                span.textContent = "Email для оформления лицензий";
            }
            if (span.textContent === "Кол-во Альт Обр(запрос)") {
                span.textContent = 'Укажите необходимое количество лицензий на ОС «Альт Образование»';
            }
            if (span.textContent === "Кол-во Альт Р.ст(запрос)") {
                span.textContent = 'Укажите необходимое количество лицензий на ОС «Альт Рабочая станция»';
            }
            if (span.textContent === "Лицензии будут использоваться") {
                span.textContent = "Как вы планируете использовать лицензии";
            }
        });


        // var newCheckbox = document.createElement('input');
        // newCheckbox.type = 'checkbox';
        // newCheckbox.id = 'additional_checkbox';
        // newCheckbox.name = 'additional_checkbox';
        // newCheckbox.value = '1';
        // newCheckbox.required = true;
        //
        // var lineBreak = document.createElement('br');
        //
        // var label = document.createElement('label');
        // label.htmlFor = 'additional_checkbox';
        // label.appendChild(document.createTextNode('Я ознакомился и принимаю '));
        //
        // var link = document.createElement('a');
        // link.href = "https://www.basealt.ru/about/policy";
        // link.className = "external";
        // link.target = "_blank";
        // link.appendChild(document.createTextNode("политику обработки персональных данных"));
        //
        // var parentElement = document.getElementById('privacy_policy_fields');
        // parentElement.appendChild(lineBreak);
        // parentElement.appendChild(newCheckbox);
        // parentElement.appendChild(label);
        // label.appendChild(link);

        $('#privacy_policy_fields').wrapInner('<div id="privacy_policy_fields1"></div>');
        $('#privacy_policy_fields').append('<div id="privacy_policy_fields2" ><input type="checkbox" id="additional_checkbox" name="additional_checkbox" value="1" required="" ><label for="additional_checkbox">Я ознакомился и принимаю <a href="https://www.basealt.ru/about/policy" class="external" target="_blank">политику обработки персональных данных</a></label></div>');


        const divBeforUsernameInput = document.getElementById('flash');
        const usernameInput = document.getElementById('username');

        const usernameSpan = document.createElement('span');
        usernameSpan.textContent = 'ФИО контактного лица образовательной организации';
        usernameSpan.classList.add('field-description');

        const emailSpan = document.createElement('span');
        emailSpan.textContent = 'Email контактного лица образовательной организации';
        emailSpan.classList.add('field-description');

        divBeforUsernameInput.insertAdjacentElement('afterend', usernameSpan);
        usernameInput.insertAdjacentElement('afterend', emailSpan);

        // $(this).attr("placeholder", "Type your answer here");
        usernameInput.placeholder='Укажите ваше ФИО полностью: Иванов Иван Иванович'; //

        document.getElementById('issue_custom_field_values_914').placeholder='Впоследствии на указанный email будет выслано приглашение для регистрации в ЛК';
        document.getElementById('issue_custom_field_values_917').placeholder='Опишите, как вы планируете использовать полученные лицензии в учебном процессе';


//        https://oldmy.basealt.space/helpdesk_widget/widget.js
// https://oldmy.basealt.space/helpdesk_widget/animation.css
// https://oldmy.basealt.space/helpdesk_widget/widget.css
//  https://oldmy.basealt.space/helpdesk_widget/load_form.json


//        $('#issue_custom_field_values_912').mask("+7(999) 999-99-99");
        $('#issue_custom_field_values_912').inputmask({"mask": "+7 (999) 999-99-99"});

        // $(selector).inputmask("99-9999999");  //static mask
        // $(selector).inputmask({"mask": "(999) 999-9999"}); //specifying options

        //$('#issue_custom_field_values_910').data('required', 'true');
//        $('.custom_field').removeAttr('data-require');
//        $('input').removeClass('required-field');




        $('#username').attr('data-parsley-required','true');
        $('#email').attr('data-parsley-type',"email").attr('data-parsley-required','true');

// data-parsley-pattern="^[\d\+\-\.\(\)\/\s]*$" ^[\d\+\-\.\(\)\/\s]*$   ^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$
//  data-parsley-pattern="^\+7 \(\d\d\d\) \d\d\d\-\d\d\-\d\d$"
        $('#issue_custom_field_values_912').attr('data-parsley-required','true').attr('data-parsley-pattern',"^\\+7 \\(\\d\\d\\d\\) \\d\\d\\d\\-\\d\\d\\-\\d\\d$");
        $('#issue_custom_field_values_909').attr('data-parsley-required','true').attr('data-parsley-inn-kpp','true');

        $('#issue_custom_field_values_914').attr('data-parsley-type',"email").attr('data-parsley-required','true');

//        $('#issue_custom_field_values_910').attr('data-parsley-required','true');

        $('#issue_custom_field_values_915').attr('data-parsley-type','digits').attr('data-parsley-amount-not-zero','#issue_custom_field_values_916');
        $('#issue_custom_field_values_916').attr('data-parsley-type','digits').attr('data-parsley-amount-not-zero','#issue_custom_field_values_915');

        $('#issue_custom_field_values_915').parsley().on('field:validated', function() {
//            console.log('ok1');
            if ($('#issue_custom_field_values_916').val() === '0' && $('#issue_custom_field_values_915').val() !== '0') {
                $('#issue_custom_field_values_916').parsley().validate();
            }
        });

        $('#issue_custom_field_values_916').parsley().on('field:validated', function() {
//            console.log('ok2');
            if ($('#issue_custom_field_values_915').val() === '0' && $('#issue_custom_field_values_916').val() !== '0') {
                $('#issue_custom_field_values_915').parsley().validate();
            }

        });


        $('#issue_custom_field_values_917').attr('data-parsley-required','true');


        $("#form-submit-btn").click(function(e){

            let parsleyInstance = $('#widget_form').parsley();
            parsleyInstance.validate();
            if (parsleyInstance.isValid()) {
                console.log('Valid');
                // let newInnKpp = prepareInnKpp($('#issue_custom_field_values_909').val());
                // $('#issue_custom_field_values_909').val(newInnKpp);
            } else {
                e.preventDefault();
            }
//                console.log($('#issue_custom_field_values_912').val());

        });


    }, 200);
});

