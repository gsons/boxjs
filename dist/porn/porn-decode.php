<?php


//解密文件
function decodeDir($dir){
    if($handle=opendir($dir)){
        while(($file=readdir($handle))!==false){
            if($file!='..'&&$file!='.'){
                $matchs=[];
                if(preg_match('/^base64_(.*)/',$file,$matchs)){
                    $file_name=$dir.'/'.base64_decode($matchs[1]);
                    rename($dir.'/'.$file, $file_name);
                }else{
                    $file_name=$dir.'/'.$file; 
                }
                if(is_dir($file_name)){
                     decodeDir($file_name);
                }
            }
        }
    }
    closedir($handle);
}

decodeDir("F:/code/lu.php/live/20220821");