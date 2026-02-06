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
    public static function isRoomAvailable(array $existingScreenings, string $newStart, string $newEnd, ?int $currentScreeningId = null): bool {
        // Normalize incoming times to DateTime and compare via timestamps to avoid
        // string-format differences (e.g. 'T' vs space) which break lexicographical checks.
        $newStartDt = new DateTime(datetime: $newStart);
        $newEndDt = new DateTime(datetime: $newEnd);
        $newStartTs = $newStartDt->getTimestamp();
        $newEndTs = $newEndDt->getTimestamp();

        foreach ($existingScreenings as $screening) {
            if ($currentScreeningId && $screening['id'] == $currentScreeningId) {
                continue;
            }
            $startDt = new DateTime(datetime: $screening['start_time']);
            $endDt = new DateTime(datetime: $screening['end_time']);
            $startTs = $startDt->getTimestamp();
            $endTs = $endDt->getTimestamp();

            if ($newStartTs < $endTs && $newEndTs > $startTs) {
                return false;
            }
        }

        return true;
    }
}
?>