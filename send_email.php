<?php
// Formulaire de contact - Portfolio Mandimbizara Juno
error_reporting(E_ALL);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Trace interne pour retour API
$debugMessages = [];
$lastError = null;

// Configurer un fichier de log dédié (évite les sorties parasites côté client)
$logDirectory = __DIR__ . '/storage/logs';
if (!is_dir($logDirectory)) {
    @mkdir($logDirectory, 0777, true);
}
$logFile = $logDirectory . '/contact.log';
ini_set('log_errors', 1);
ini_set('error_log', $logFile);

// Fonction pour logger (seulement dans error_log, pas echo)
function debugLog($message) {
    global $debugMessages;
    $entry = "[" . date('H:i:s') . "] " . $message;
    $debugMessages[] = $entry;
    error_log("[DEBUG] " . $message);
}

// Charger les variables d'environnement
function loadEnv($path) {
    if (!file_exists($path)) {
        return false;
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        $value = trim($value, '"');
        
        if (!array_key_exists($name, $_ENV)) {
            putenv(sprintf('%s=%s', $name, $value));
            $_ENV[$name] = $value;
        }
    }
    return true;
}

loadEnv(__DIR__ . '/.env');

debugLog("=== DÉBUT DU SCRIPT ===");

// Vérifier que c'est une requête POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    debugLog("Erreur: Méthode non POST");
    $lastError = "Méthode HTTP invalide";
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée',
        'details' => $debugMessages,
        'error' => $lastError,
    ]);
    exit;
}

// Récupérer les données du formulaire
$data = json_decode(file_get_contents('php://input'), true);
debugLog("Données reçues: " . print_r($data, true));

if (!$data) {
    $data = $_POST;
}

// Validation des données
$name = isset($data['name']) ? trim($data['name']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$phone = isset($data['phone']) ? trim($data['phone']) : '';
$subject = isset($data['subject']) ? trim($data['subject']) : '';
$message = isset($data['message']) ? trim($data['message']) : '';

debugLog("Nom: $name, Email: $email, Sujet: $subject");

if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    debugLog("Erreur: Champs manquants");
    $lastError = "Champs manquants";
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Tous les champs obligatoires doivent être remplis',
        'details' => $debugMessages,
        'error' => $lastError,
    ]);
    exit;
}

// Configuration SMTP
$smtpHost = getenv('MAIL_HOST');
$smtpPort = getenv('MAIL_PORT');
$smtpUsername = getenv('MAIL_USERNAME');
$smtpPassword = getenv('MAIL_PASSWORD');
$smtpEncryption = getenv('MAIL_ENCRYPTION');
$fromAddress = getenv('MAIL_FROM_ADDRESS');
$fromName = getenv('MAIL_FROM_NAME');
$toAddress = getenv('MAIL_TO_ADDRESS') ?: 'mandimbizarajuno@gmail.com';

debugLog("Config SMTP: $smtpHost:$smtpPort, User: $smtpUsername");

$subjectMap = [
    'reservation' => 'Réservation de visite',
    'information' => 'Demande d\'information',
    'group' => 'Visite de groupe',
    'partnership' => 'Partenariat',
    'other' => 'Autre'
];

$subjectText = isset($subjectMap[$subject]) ? $subjectMap[$subject] : $subject;
$emailSubject = "🏝️ Contact Mandimbizara Juno - " . $subjectText;

// Corps de l'email en HTML
$emailBody = "<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { 
            font-family: 'Space Grotesk', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #0A0F27;
            background-color: #f4f7fb;
            margin: 0;
            padding: 0;
        }
        .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(10, 15, 39, 0.08);
            border: 1px solid rgba(4, 55, 117, 0.08);
        }
        .header { 
            background: linear-gradient(135deg, #043775 0%, #12769E 100%); 
            color: white; 
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .header p {
            margin: 5px 0 0 0;
            font-size: 13px;
            opacity: 0.85;
        }
        .content { 
            padding: 30px;
        }
        .info-section {
            background: #f6f9ff;
            border-left: 4px solid #12769E;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 5px;
            border: 1px solid rgba(18, 118, 158, 0.15);
        }
        .info-row {
            margin-bottom: 15px;
        }
        .info-row:last-child {
            margin-bottom: 0;
        }
        .label { 
            font-weight: 600;
            color: #043775;
            display: inline-block;
            min-width: 100px;
        }
        .message-section {
            background: #ffffff;
            border: 1px solid rgba(4, 55, 117, 0.12);
            padding: 20px;
            border-radius: 5px;
            margin-top: 20px;
            box-shadow: inset 0 1px 0 rgba(18, 42, 82, 0.05);
        }
        .message-label {
            font-weight: 600;
            color: #043775;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .message-content {
            color: #0A0F27;
            white-space: pre-wrap;
            line-height: 1.8;
        }
        .footer { 
            background: #f6f9ff;
            text-align: center; 
            padding: 20px;
            color: #043775; 
            font-size: 12px;
            border-top: 1px solid rgba(4, 55, 117, 0.1);
        }
        .reply-button {
            display: inline-block;
            background: linear-gradient(135deg, #12769E 0%, #043775 100%);
            color: #ffffff;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            font-weight: 600;
            box-shadow: 0 15px 30px rgba(18, 118, 158, 0.3);
        }
        .icon {
            display: inline-block;
            margin-right: 8px;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>📧 Nouveau Message de Contact</h1>
            <p>Portfolio de Mandimbizara Juno</p>
        </div>
        
        <div class='content'>
            <div class='info-section'>
                <div class='info-row'>
                    <span class='label'>👤 Nom :</span>
                    <span class='value'>" . htmlspecialchars($name) . "</span>
                </div>
                <div class='info-row'>
                    <span class='label'>📧 Email :</span>
                    <span class='value'><a href='mailto:" . htmlspecialchars($email) . "' style='color: #4adeff; text-decoration: none;'>" . htmlspecialchars($email) . "</a></span>
                </div>
                " . (!empty($phone) ? "
                <div class='info-row'>
                    <span class='label'>📞 Téléphone :</span>
                    <span class='value'>" . htmlspecialchars($phone) . "</span>
                </div>
                " : "") . "
                <div class='info-row'>
                    <span class='label'>📋 Sujet :</span>
                    <span class='value'>" . htmlspecialchars($subjectText) . "</span>
                </div>
                <div class='info-row'>
                    <span class='label'>🕐 Date :</span>
                    <span class='value'>" . date('d/m/Y à H:i') . "</span>
                </div>
            </div>
            
            <div class='message-section'>
                <div class='message-label'>💬 Message :</div>
                <div class='message-content'>" . nl2br(htmlspecialchars($message)) . "</div>
            </div>
            
            <div style='text-align: center;'>
                <a href='mailto:" . htmlspecialchars($email) . "' class='reply-button'>
                    ↩️ Répondre au client
                </a>
            </div>
        </div>
        
        <div class='footer'>
            <p><strong>Ce message a été envoyé depuis le formulaire de contact du site web</strong></p>
            <p>Nosy-Be, Madagascar</p>
            <p>📞 +261 32 66 875 43 | 📧 mandimbizarajuno@gmail.com</p>
        </div>
    </div>
</body>
</html>";

debugLog("Sujet email: $emailSubject");

// Fonction d'envoi SMTP avec logs
function sendSMTPEmailDebug($host, $port, $username, $password, $encryption, $from, $fromName, $to, $subject, $body, $replyTo = null) {
    global $lastError;
    try {
        debugLog("Tentative de connexion à $host:$port avec $encryption");
        
        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ]);
        
        if ($encryption === 'ssl') {
            $smtp = @stream_socket_client("ssl://{$host}:{$port}", $errno, $errstr, 30, STREAM_CLIENT_CONNECT, $context);
        } else {
            $smtp = @stream_socket_client("{$host}:{$port}", $errno, $errstr, 30, STREAM_CLIENT_CONNECT, $context);
        }
        
        if (!$smtp) {
            debugLog("ERREUR: Connexion échouée - $errstr ($errno)");
            $lastError = "Connexion SMTP échouée : $errstr ($errno)";
            return false;
        }
        
        debugLog("✓ Connexion établie");
        
        $getResponse = function() use ($smtp) {
            $response = '';
            while ($line = fgets($smtp, 515)) {
                $response .= $line;
                if (isset($line[3]) && $line[3] == ' ') break;
            }
            return $response;
        };
        
        // Lire le message de bienvenue
        $response = $getResponse();
        debugLog("Bienvenue: " . trim($response));
        
        // EHLO
        fputs($smtp, "EHLO {$host}\r\n");
        $response = $getResponse();
        debugLog("EHLO: " . trim(substr($response, 0, 100)));
        
        // AUTH PLAIN
        $authString = base64_encode("\0{$username}\0{$password}");
        fputs($smtp, "AUTH PLAIN {$authString}\r\n");
        $response = $getResponse();
        debugLog("AUTH: " . trim($response));
        
        if (strpos($response, '235') === false) {
            debugLog("ERREUR: Authentification échouée");
            $lastError = "Authentification SMTP échouée";
            fclose($smtp);
            return false;
        }
        
        debugLog("✓ Authentification réussie");
        
        // MAIL FROM
        fputs($smtp, "MAIL FROM: <{$from}>\r\n");
        $response = $getResponse();
        debugLog("MAIL FROM: " . trim($response));
        
        // RCPT TO
        fputs($smtp, "RCPT TO: <{$to}>\r\n");
        $response = $getResponse();
        debugLog("RCPT TO: " . trim($response));
        
        // DATA
        fputs($smtp, "DATA\r\n");
        $response = $getResponse();
        debugLog("DATA: " . trim($response));
        
        // En-têtes et corps (HTML)
        $headers = "From: {$fromName} <{$from}>\r\n";
        $headers .= "Reply-To: " . ($replyTo ? $replyTo : $from) . "\r\n";
        $headers .= "To: <{$to}>\r\n";
        $headers .= "Subject: {$subject}\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "Content-Transfer-Encoding: quoted-printable\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
        $headers .= "X-Priority: 3\r\n";
        $headers .= "Message-ID: <" . time() . "." . md5($to . $subject) . "@pixel-rise.com>\r\n";
        
        // Encoder le corps en quoted-printable
        $body = quoted_printable_encode($body);
        
        fputs($smtp, $headers . "\r\n" . $body . "\r\n.\r\n");
        $response = $getResponse();
        debugLog("Envoi: " . trim($response));
        
        if (strpos($response, '250') === false) {
            debugLog("ERREUR: Envoi échoué");
            $lastError = "Le serveur SMTP a refusé le message (code: " . trim($response) . ")";
            fclose($smtp);
            return false;
        }
        
        debugLog("✓ Email envoyé avec succès!");
        
        fputs($smtp, "QUIT\r\n");
        fclose($smtp);
        
        return true;
    } catch (Exception $e) {
        debugLog("EXCEPTION: " . $e->getMessage());
        $lastError = "Exception SMTP : " . $e->getMessage();
        return false;
    }
}

// Envoyer l'email (avec l'email du client dans Reply-To)
$sent = sendSMTPEmailDebug(
    $smtpHost,
    $smtpPort,
    $smtpUsername,
    $smtpPassword,
    $smtpEncryption,
    $fromAddress,
    $fromName,
    $toAddress,
    $emailSubject,
    $emailBody,
    $email  // Email du client pour Reply-To
);

debugLog("=== FIN DU SCRIPT ===");

if ($sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Email envoyé avec succès!',
        'details' => $debugMessages
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Échec de l\'envoi',
        'error' => $lastError ?: 'Erreur SMTP inconnue',
        'details' => $debugMessages
    ]);
}
?>
