<?
if(preg_match('#^/album/(\d+)$#',$_SERVER['REQUEST_URI'],$m1)){
    $id = $m1[1];
}
elseif(isset($_GET['id'])){
    $id = $_GET['id'];
}
else{
    http_response_code(404);
    exit;
}

if($_SERVER['HTTP_ORIGIN'] == 'https://renevandenberg.github.io'){
    header("Access-Control-Allow-Origin: https://renevandenberg.github.io");
}

$ch = curl_init('https://bandcamp.com/EmbeddedPlayer/ref='.rawurlencode($_SERVER['HTTP_REFERER']).'/album='.$id);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-Forwarded-For: ' . $_SERVER['REMOTE_ADDR'],'Forwarded: for='. $_SERVER['REMOTE_ADDR']]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
$content = curl_exec($ch);
echo curl_error($ch);

if(preg_match('/data-player-data="([^"]*)"/',$content,$m2)){
    header("Content-type: application/json");
    $seconds_to_cache = 3600;
    $ts = gmdate("D, d M Y H:i:s", time() + $seconds_to_cache) . " GMT";
    header("Expires: $ts");
    header("Pragma: cache");
    header("Cache-Control: max-age=$seconds_to_cache");
    echo html_entity_decode($m2[1]);
}
else{
    http_response_code(401);
    exit;
}
?>