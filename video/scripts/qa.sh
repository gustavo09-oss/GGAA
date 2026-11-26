#!/usr/bin/env bash
# Checagem: duração, faixas de áudio, tamanho e quadros nos segundos 1,5,10,14,19,24,28
set -euo pipefail
cd "$(dirname "$0")/../../output"
mkdir -p ../video/out/qa
for f in criativo_*.mp4; do
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  n=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 "$f")
  a=$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$f" | wc -l)
  s=$(du -m "$f" | cut -f1)
  echo "$f  duração=${d}s  frames=$n  faixas_de_áudio=$a  tamanho=${s}MB"
  for t in 1 5 10 14 19 24 28; do
    ffmpeg -v error -y -ss "$t" -i "$f" -frames:v 1 "../video/out/qa/${f%.mp4}_${t}s.png"
  done
done
