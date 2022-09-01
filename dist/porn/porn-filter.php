<?php

//找出所有非视频非压缩包的资源
function fetchDir($dir){
    //file_sum 标记文件夹的文件个数
    $obj=['del_files'=>[],'file_sum'=>0,'del_dirs'=>[]];
    if($handle=opendir($dir)){
        while(($file=readdir($handle))!==false){
            if($file!='..'&&$file!='.'){
                $file=$dir.'/'.$file;
                if(is_dir($file)){
                     $temp=fetchDir($file);
                     $obj['del_files']=array_merge($obj['del_files'],$temp['del_files']);
                     $obj['del_dirs']=array_merge($obj['del_dirs'],$temp['del_dirs']);
                     $obj['file_sum']+=$temp['file_sum'];
                }else{
                    if(!preg_match('/\.(avi|wmv|mpeg|mp4|m4v|mov|asf|flv|f4v|rmvb|3gp|vob|7z|rar|zip)$/',$file)&&!preg_match('/(baidu)/',$file)){
                      $obj['del_files'][]=$file;
                      if(file_exists($file)){
                        @unlink($file);
                        echo "unlink {$file}".PHP_EOL;
                      }
                    }
                    $obj['file_sum']++;
                }
            }
        }
    }
    if($obj['file_sum']==0){
        $obj['del_dirs'][]=$dir;
        if(is_dir($dir)){
            @rmdir($dir);
            echo "rmdir {$dir}".PHP_EOL;
        }
    }
    closedir($handle);
    return $obj;
}
$obj=fetchDir('F:/code/lu.php/');
$count_dir=count($obj['del_dirs']);
$count_file=count($obj['del_files']);
echo "总文件个数{$obj['file_sum']} 删除文件夹个数{$count_dir} 删除文件个数{$count_file}".PHP_EOL;



