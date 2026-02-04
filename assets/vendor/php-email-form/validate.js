/**
* PHP Email Form Validation - v3.11
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData( thisForm );

      if ( recaptcha ) {
        if(typeof grecaptcha !== "undefined" ) {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
              .then(token => {
                formData.set('recaptcha-response', token);
                php_email_form_submit(thisForm, action, formData);
              })
            } catch(error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    var isFormspree = action.indexOf('formspree.io') !== -1;
    var headers = {'X-Requested-With': 'XMLHttpRequest'};
    if (isFormspree) headers['Accept'] = 'application/json';

    fetch(action, {
      method: 'POST',
      body: formData,
      headers: headers
    })
    .then(function(response) {
      if (response.ok) {
        return isFormspree ? response.json() : response.text();
      }
      if (isFormspree) {
        return response.json().then(function(err) {
          throw new Error(err.error || response.status + ' ' + response.statusText);
        }).catch(function(e) {
          if (e.message) throw e;
          throw new Error(response.status + ' ' + response.statusText);
        });
      }
      throw new Error(response.status + ' ' + response.statusText + ' ' + response.url);
    })
    .then(function(data) {
      thisForm.querySelector('.loading').classList.remove('d-block');
      var success = (typeof data === 'string' && data.trim() === 'OK') || (data && data.ok === true);
      if (success) {
        thisForm.querySelector('.sent-message').classList.add('d-block');
        thisForm.reset();
      } else {
        throw new Error(data && data.error ? data.error : (typeof data === 'string' ? data : 'Form submission failed.'));
      }
    })
    .catch(function(error) {
      displayError(thisForm, error);
    });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
