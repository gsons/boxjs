<?php
$info=isset($_GET['str'])?$_GET['str']:'';
file_put_contents('log.txt',date("Y-m-d H:i:s").' '.$info.PHP_EOL,FILE_APPEND);
