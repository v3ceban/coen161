<?php

function pieChart()
{
  function describeArc($x, $y, $radius, $startAngle, $endAngle)
  {
    $start = polarToCartesian($x, $y, $radius, $endAngle);
    $end = polarToCartesian($x, $y, $radius, $startAngle);
    $largeArcFlag = $endAngle - $startAngle <= 180 ? "0" : "1";
    $d = [
      "M",
      $start['x'],
      $start['y'],
      "A",
      $radius,
      $radius,
      0,
      $largeArcFlag,
      0,
      $end['x'],
      $end['y'],
      "L",
      $x,
      $y,
      "Z",
    ];
    return implode(" ", $d);
  }

  function polarToCartesian($centerX, $centerY, $radius, $angleInDegrees)
  {
    $angleInRadians = (($angleInDegrees - 90) * M_PI) / 180.0;
    return [
      'x' => $centerX + $radius * cos($angleInRadians),
      'y' => $centerY + $radius * sin($angleInRadians)
    ];
  }

  function getColor()
  {
    $pastelColors = [
      "#FFC3A0",
      "#FFD3FF",
      "#FFDFD3",
      "#D3E1FF",
      "#FFEDD8",
      "#FFD8E9",
      "#D3FFFC",
      "#E1D3FF",
      "#FFD8B1",
      "#D3F3FF",
    ];
    if (!isset($_SESSION['color_counter'])) {
      $_SESSION['color_counter'] = 0;
    }
    if ($_SESSION['color_counter'] < count($pastelColors)) {
      return $pastelColors[$_SESSION['color_counter']++];
    } else {
      return "#" . dechex(mt_rand(0, 0xFFFFFF));
    }
  }

  // Assuming you have a data.json file in the same directory
  $data = json_decode(file_get_contents('./app/data.json'), true);

  $total = array_reduce($data, function ($acc, $curr) {
    return $acc + $curr['value'];
  }, 0);

  $svg = '<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">';

  $centerX = 200;
  $centerY = 200;
  $radius = min($centerX, $centerY) - 100;
  $startAngle = 0;

  foreach ($data as $key => $item) {
    $sliceAngle = ($item['value'] / $total) * 360;
    $endAngle = $startAngle + $sliceAngle;
    $middleAngle = ($startAngle + $endAngle) / 2;
    $middlePoint = polarToCartesian($centerX, $centerY, $radius * 1.3, $middleAngle);
    $color = getColor();

    if (count($data) === 1) {
      $circle = '<circle cx="' . $centerX . '" cy="' . $centerY . '" r="' . $radius . '" fill="' . $color . '" />';
      $svg .= $circle;

      $text = '<text x="' . $middlePoint['x'] . '" y="' . $middlePoint['y'] . '" text-anchor="middle">' . $item['name'] . ' ' . (($item['value'] / $total) * 100) . '%</text>';
      $svg .= $text;

      $square = '<rect width="15" height="15" fill="' . $color . '" x="' . ($middlePoint['x'] + 15) . '" y="' . ($middlePoint['y'] - 13) . '"/>';
      $svg .= $square;

      break;
    }

    $path = '<path d="' . describeArc($centerX, $centerY, $radius, $startAngle, $endAngle) . '" fill="' . $color . '" />';
    $svg .= $path;

    $text = '<text x="' . ($middlePoint['x'] + 10) . '" y="' . $middlePoint['y'] . '" text-anchor="end">' . $item['name'] . '</text>';
    $svg .= $text;

    $square = '<rect width="15" height="15" fill="' . $color . '" x="' . ($middlePoint['x'] + 15) . '" y="' . ($middlePoint['y'] - 13) . '"/>';
    $svg .= $square;

    $startAngle = $endAngle;
  }

  $svg .= '</svg>';

  echo $svg;
}
