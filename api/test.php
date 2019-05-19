<?php
$dir = new SplFileInfo('../../songs');
echo "Directory modified time is %s and size is %d bytes.";
echo date('d/m/Y H:i:s', $dir->getMTime());
echo $dir->getSize();
?>