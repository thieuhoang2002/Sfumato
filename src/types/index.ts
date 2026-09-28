export type AspectRatio = '9:16' | '1:1' | '16:9';

export type MotionPreset = 
  | 'shatter-assemble'   // Phân rã tản mác 4 phương -> Hút xoáy hợp nhất va đập (THE WOW DISRUPTIVE)
  | 'cross-drift'        // Đan chéo đối kháng 2 bên lao vào nhau xé gió
  | 'card-flip-3d'       // Xòe bài 3D trong không gian -> Khóa cạch đanh thép
  | 'echo-ghost'         // Bóng ma phân thân 4 hướng -> Thu hồi chớp nhoáng
  | 'brutalist-giant'    // Bất đối xứng cực hạn: Từ chính khổng lồ chiếm 70% khung hình
  | 'elastic-spring'     // Co giãn dây cao su đàn hồi & nhịp thở vật lý
  | 'hyper-velocity'     // Lao vút từ vô tận, zoom bùng nổ, phanh gấp rung chấn
  | 'liquid-chrome'      // Tráng gương kim loại bạc ánh kim, lơ lửng 3D
  | 'film-burn'          // Vintage 16mm: Vệt cháy phim cam ấm áp
  | 'liquid-smoke';      // Khói mờ Sfumato Phục Hưng loang nở như mực

export interface LyricWord {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  isHero?: boolean;
}

export interface LyricLine {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  words?: LyricWord[];
  synced: boolean;
}

export type FontChoice = 
  | 'Unbounded'          // Futuristic Neo-Grotesk cực dày mở rộng (Đỉnh cao xu hướng toàn cầu)
  | 'Cinzel'             // La Mã quý tộc, sắc lẹm như lưỡi kiếm (Haute Couture)
  | 'Montserrat'         // Black 900 Italic thể thao tốc độ (Chuẩn MV Hip-Hop)
  | 'Archivo Black'      // Nặng ký, đanh thép tuyệt đối (Brutalist poster)
  | 'Prata'              // Serif thời trang Paris tương phản cao ngút ngàn
  | 'Epilogue'           // Brutalist Display vát góc cá tính
  | 'Sedgwick Ave'       // Graffiti / Nét cọ đường phố chất chơi
  | 'Philosopher'        // Serif huyền ảo uốn lượn độc lạ
  | 'Playfair Display'   // Serif quý phái lãng mạn điện ảnh
  | 'Be Vietnam Pro';    // Chuẩn mực đương đại quốc tế

export interface StylingOptions {
  fontFamily: FontChoice;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  textColor: string;
  glowEffect: boolean;
  glowIntensity: number;
  lineHeight: number;
  alignment: 'center' | 'left' | 'right';
  motionPreset: MotionPreset;
  aspectRatio: AspectRatio;
  showSafeZone: boolean;
  
  // Hiệu ứng điện ảnh
  enableFilmGrain: boolean;
  filmBurnEffect: boolean;
  chromeReflect: boolean;
  cameraShake: boolean;
  crtScanlines: boolean;
  heroWordAccent: 'scale' | 'outline' | 'badge' | 'none';
  chromaticAberration: boolean;
  textCase: 'none' | 'uppercase' | 'lowercase';
}
