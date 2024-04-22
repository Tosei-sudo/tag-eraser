window.onload = function () {
    Vue.createApp({
        data() {
            return {
                rawHTML: '',
                isEraseScriptBody: true,
                isEraseStyleBody: true,
                isEraseComment: true,
                isEraseSpace: true,
                resultHTML: ''
            }
        },
        methods: {
            erase(e) {
                e.preventDefault();

                // Erase the all tags
                let draft, domParser = new DOMParser();
                draft = domParser.parseFromString(this.rawHTML, 'text/html');

                if (this.isEraseScriptBody) {
                    let script = $("script", draft);
                    script.remove();
                }

                if (this.isEraseStyleBody) {
                    let style = $("style", draft);
                    style.remove();
                }

                if (this.isEraseComment) {
                    let comment = $("*", draft).contents().filter(function () {
                        return this.nodeType === 8;
                    });
                    comment.remove();
                }

                let body = $("body", draft);
                this.resultHTML = body[0].innerText;

                if (this.isEraseSpace) {
                    // 連続する空白、連続する改行を削除
                    this.resultHTML = this.resultHTML.replace(/\s\s+/g, "\n");
                    this.resultHTML = this.resultHTML.replace(/\n+/g, "\n");

                    // 前後の空白を削除
                    this.resultHTML = this.resultHTML.replace(/^\s+|\s+$/g, "");
                }
            },
            clear(e) {
                e.preventDefault();
                this.rawHTML = '';
                this.resultHTML = '';

                this.isEraseScriptBody = true;
                this.isEraseStyleBody = true;
                this.isEraseComment = true;
                this.isEraseSpace = true;
            },
            copy(e) {
                e.preventDefault();

                navigator.clipboard.writeText(this.resultHTML).then(function () {
                    console.log('Async: Copying to clipboard was successful!');
                    alert('コピーしました');
                }, function (err) {
                    console.error('Async: Could not copy text: ', err);
                    alert('コピーに失敗しました');
                });
            },
            getHtmlFromUrl(e) {
                e.preventDefault();

                let url = prompt('URLを入力してください', 'https://');
                if (url == null || url == '') {
                    return;
                }

                url = "Proxy.php?url=" + url;

                fetch(url, {
                    method: 'GET',
                }).then(response => response.text()).then(data => {
                    this.rawHTML = data;
                });
            },
            download(e) {
                e.preventDefault();

                let blob = new Blob([this.resultHTML], { type: 'text/plain' });
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = 'result.txt';
                a.click();
                window.URL.revokeObjectURL(url);
            }
        }
    }).mount('#app');
};