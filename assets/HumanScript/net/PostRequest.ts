
export class PostRequest {
    public _main_boundary = "";
    private _array_form_data = {};

    constructor() {
        this._main_boundary = this.getBoundary();
    }

    public getPostData() {
        var _form_name: string = "";
        var _post_data = "";

        //속성 추가
        for (_form_name in this._array_form_data) {
            _post_data = this.writeBoundary(_post_data, this._main_boundary);

            _post_data = this.writeLineBreak(_post_data);
            _post_data = this.writeString(_post_data, 'Content-Disposition: form-data; name="' + _form_name + '"');
            _post_data = this.writeLineBreak(_post_data);
            _post_data = this.writeLineBreak(_post_data);
            _post_data += this._array_form_data[_form_name];
            _post_data = this.writeLineBreak(_post_data);
        }

        //닫기
        _post_data = this.writeBoundary(_post_data, this._main_boundary);
        _post_data = this.writeDoubleDash(_post_data);
        _post_data = this.writeLineBreak(_post_data);

        return _post_data;
    }


    private getBoundary() {
        var _boundary = "";
        if (_boundary.length == 0) {
            for (var i = 0; i < 0x20; i++) {
                _boundary += String.fromCharCode(97 + Math.random() * 25);
            }
        }

        return _boundary;
    }

    //Add a Property
    public addFormData(form_name, data) {
        this._array_form_data[form_name] = data;
    }


    //바이너리에 문자열 쓰기
    private writeString(_post_data, str) {
        _post_data += str
        return _post_data;
    }

    //바이너리에 바운더리 쓰기
    private writeBoundary(_post_data, _boundary) {
        _post_data = this.writeDoubleDash(_post_data);
        _post_data += _boundary
        return _post_data;
    }

    //바이너리에 라인 쓰기
    private writeLineBreak(_post_data) {
        _post_data += "\n";
        return _post_data;
    }

    //바이너리에 "--" 쓰기
    private writeDoubleDash(_post_data) {
        _post_data += "--";
        return _post_data;
    }

}
