<?php
class Response implements JsonSerializable{
    private $responseType;
    private $responseMessage;
    function __construct(string $responseType, mixed $responseMessage) {
    $this->responseType = $responseType;
    $this->responseMessage = $responseMessage;
}
    public function getRespType(){
        return $this->responseType;
    }
    public function getRespMessage(){
        return $this->responseMessage;
    }
    public function jsonSerialize(): mixed {
    return [
        "status" => $this->responseType,
        "message" => $this->responseMessage
    ];
}
}
?>