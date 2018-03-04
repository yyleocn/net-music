import SparkMD5 from 'spark-md5';

let fileMD5Hash = (file_) => {
    console.log('Hash file md5');
    return new Promise((resolve_, reject_) => {
        if (!file_) {
            reject_('Invalid md5 check file.');
            return;
        }
        let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
        let chunkSize = 2 * 1024 * 1024;
        let chunks = Math.ceil(file_.size / chunkSize);
        let currentChunk = 0;
        let spark = new SparkMD5.ArrayBuffer();
        let fileReader = new FileReader();

        let loadNext = () => {
            let start = currentChunk * chunkSize,
                end = ((start + chunkSize) >= file_.size) ? file_.size : start + chunkSize;
            fileReader.readAsArrayBuffer(blobSlice.call(file_, start, end));
        };

        fileReader.onload = (event_) => {
            spark.append(event_.target.result);
            currentChunk++;
            if (currentChunk < chunks) {
                loadNext();
            } else {
                let md5Res = spark.end();
                resolve_(md5Res);
            }
        };

        fileReader.onerror = function () {
            reject_('MD5 hash failed.');
        };

        loadNext();
    });
};

export default fileMD5Hash;