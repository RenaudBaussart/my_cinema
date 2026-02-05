<?php
require_once __DIR__ . '/../repositories/RoomRepository.php';
require_once __DIR__ . '/../repositories/MovieRepository.php';
require_once __DIR__ . '/../class/Response.php';
Class ScreeningService{
    public static function addMinutesToDate(string $dateString, int $minutes): string {
        $date = new DateTime(datetime: $dateString);
        $date->modify(modifier: "+$minutes minutes");
        return $date->format(format: 'Y-m-d H:i:s');
    }
}
?>