package gairos.xrpl_radar.common;

public class ResponseDto<T> {
    private boolean success;
    private int code;
    private String message;
    private T data;

    public ResponseDto(boolean success, int code, String message, T data) {
        this.success = success;
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public static <T> ResponseDto<T> success(String message, T data) {
        return new ResponseDto<>(true, 200, message, data);
    }

    public static <T> ResponseDto<T> fail(String message) {
        return new ResponseDto<>(false, 400, message, null);
    }

    public boolean isSuccess() { return success; }
    public int getCode() { return code; }
    public String getMessage() { return message; }
    public T getData() { return data; }
}