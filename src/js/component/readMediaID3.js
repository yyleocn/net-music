import jsmediatags from 'jsmediatags';

let readMediaID3=(file_) =>{
    console.log('Read media file ID3');
    return new Promise((resolve_, reject_) => {
        jsmediatags.read(file_, {
            onSuccess: (tag_) => {
                let tags = {
                    fileName: file_.name,
                };
                if (tag_.tags) {
                    [
                        'album', 'artist', 'title',
                    ].forEach((key_) => {
                        tags[key_] = tag_.tags[key_];
                    });
                    if (tag_.tags.picture) {
                        tags.coverImg = tag_.tags.picture;
                    }
                    resolve_(tags);
                    return;
                }
                resolve_();
        },
            onError: (err_) => {
                resolve_();
            },
        });
    });
};
export default readMediaID3;