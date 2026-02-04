<?php
/**
 * PHP Email Form - Implémentation minimale pour le formulaire de contact.
 * Champs utilisés côté formulaire : name, email, phone, message uniquement.
 * email_subject = sujet de l’email (défini par le script, pas par l’utilisateur).
 * Envoi via mail(). Retourne "OK" en cas de succès pour l’AJAX.
 */

class PHP_Email_Form {
  public $ajax = false;
  public $to = '';
  public $from_name = '';
  public $from_email = '';
  /** Sujet de l’email (fixe, pas un champ du formulaire) */
  public $email_subject = '';
  public $smtp = array();
  private $messages = array();

  public function add_message( $value, $label, $max_length = 0 ) {
    $value = trim( $value );
    if ( $max_length && strlen( $value ) > $max_length ) {
      $value = substr( $value, 0, $max_length );
    }
    $this->messages[] = array( 'label' => $label, 'value' => $value );
  }

  public function send() {
    $body = '';
    foreach ( $this->messages as $msg ) {
      $body .= $msg['label'] . ': ' . $msg['value'] . "\n";
    }
    $headers = 'From: ' . $this->from_name . ' <' . $this->from_email . '>' . "\r\n";
    $headers .= 'Reply-To: ' . $this->from_email . "\r\n";
    $headers .= 'Content-Type: text/plain; charset=UTF-8' . "\r\n";

    $sent = @mail( $this->to, $this->email_subject, $body, $headers );
    if ( $sent ) {
      return 'OK';
    }
    return 'Erreur lors de l\'envoi du message. Vérifiez la configuration du serveur (mail/SPF).';
  }
}
