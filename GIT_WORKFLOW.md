# 🌿 GIT_WORKFLOW — Quy trình Làm việc với Git & Phân nhánh

> Tài liệu quy định chuẩn mực quản lý mã nguồn, quy tắc đặt tên nhánh, định dạng commit và quy trình kiểm duyệt code (Code Review) cho dự án Sfumato.

---

## 🌳 1. Mô hình Phân nhánh (Branching Strategy)

Dự án áp dụng mô hình **Trunk-based Development có kiểm soát** (hoặc GitHub Flow rút gọn), tối ưu cho tốc độ lặp lại sản phẩm nhanh chóng nhưng vẫn đảm bảo tính ổn định của nhánh phát hành:

```
[main] ──────────────────────────●──────────────●────── (Production Ready)
           │                    ▲              ▲
           ▼                    │ (PR Merge)   │ (Hotfix)
[develop] ─●──────────●─────────┘              │
             │        ▲                        │
             ▼        │ (PR)                   │
[feature/xxx] ────────┘                        │
                                               │
[hotfix/xxx] ──────────────────────────────────┘
```

### Chi tiết các loại nhánh:

1. **`main` (Production Branch)**:
   - Đại diện cho phiên bản chạy ổn định nhất đã sẵn sàng triển khai (Production Ready).
   - Được bảo vệ nghiêm ngặt (Protected branch): **Tuyệt đối không push trực tiếp**.
   - Mọi thay đổi bắt buộc phải thông qua Pull Request (PR) được duyệt và vượt qua bài test build `npm run build`.

2. **`develop` (Staging / Development Branch)**:
   - Nhánh tích hợp các tính năng chuẩn bị cho lần phát hành tiếp theo.
   - Các nhánh tính năng sẽ rẽ nhánh từ đây và gộp về đây.

3. **`feature/<ten-tinh-nang>`**:
   - Dùng khi phát triển tính năng mới.
   - Ví dụ: `feature/wavesurfer-timeline`, `feature/mp4-export-wasm`, `feature/preset-customizer`.
   - Vòng đời ngắn: Sau khi merge vào `develop` sẽ xóa nhánh để tránh rác repository.

4. **`fix/<ma-loi-hoac-mo-ta>` (hoặc `hotfix/xxx`)**:
   - Dùng để sửa lỗi phát hiện trong quá trình phát triển hoặc lỗi nóng trên production.
   - Ví dụ: `fix/bug-001-layout-collapse`, `fix/vietnamese-font-subset`, `hotfix/safari-playback`.

---

## ✍️ 2. Quy chuẩn Định dạng Commit (Conventional Commits)

Mỗi commit message phải tuân thủ nghiêm ngặt định dạng chuẩn quốc tế:

```
<type>(<scope>): <mô tả ngắn gọn bằng thể mệnh lệnh>

[Nội dung mô tả chi tiết nếu cần]

[Liên kết issue/task nếu có]
```

### Các tiền tố (`type`) được chấp nhận:

| Type | Ý nghĩa & Khi nào sử dụng | Ví dụ thực tế |
| :--- | :--- | :--- |
| `feat` | Thêm một tính năng mới | `feat(canvas): add shatter-assemble kinetic motion preset` |
| `fix` | Sửa chữa một lỗi kỹ thuật | `fix(layout): prevent style controls panel from collapsing canvas` |
| `docs` | Thêm hoặc sửa tài liệu markdown | `docs(spec): update PROJECT_SPEC.md with CapCut integration flow` |
| `style` | Định dạng code (khoảng trắng, dấu chấm phẩy, không đổi logic) | `style(timeline): reformat tailwind utility classes` |
| `refactor` | Tái cấu trúc code (không thêm tính năng, không sửa lỗi) | `refactor(audio): extract audio context muxing logic to custom hook` |
| `perf` | Tối ưu hóa hiệu năng render | `perf(export): optimize canvas 60fps frame capturing loop` |
| `chore` | Cập nhật cấu hình build, dependencies, npm packages | `chore(deps): update framer-motion to v12.4.0` |

---

## 🔄 3. Quy trình Đẩy code & Tạo Pull Request (PR)

### Bước 1: Đồng bộ mã nguồn mới nhất từ remote
```bash
git checkout develop
git pull origin develop
```

### Bước 2: Tạo nhánh làm việc mới
```bash
git checkout -b feature/audio-waveform-editor
```

### Bước 3: Code và Commit đúng chuẩn
```bash
git add .
git commit -m "feat(timeline): integrate wavesurfer.js for interactive waveform display"
```

### Bước 4: Kiểm tra tính toàn vẹn trước khi đẩy code (Pre-push verification)
Bắt buộc chạy lệnh kiểm tra build thành công 100%:
```bash
npm run build
```
Nếu có lỗi TypeScript hoặc Vite bundler, phải sửa hết trước khi push.

### Bước 5: Đẩy nhánh lên Remote Repository & Mở PR
```bash
git push -u origin feature/audio-waveform-editor
```
Mở giao diện GitHub / GitLab để tạo Pull Request từ `feature/audio-waveform-editor` vào `develop`.

---

## 🛡️ 4. Quy tắc Kiểm duyệt (Code Review & Merge Guidelines)

1. **Điều kiện để được Merge**:
   - Ít nhất 1 Lead Reviewer phê duyệt (Approved).
   - Pipeline CI/CD tự động kiểm tra `npm run build` và `tsc` phải pass hoàn toàn (màu xanh).
   - Không còn unresolved comments từ reviewers.
2. **Chiến lược Merge**:
   - Sử dụng **Squash and Merge** đối với các feature branch nhỏ để giữ lịch sử commit của nhánh `main` luôn sạch đẹp và dễ tra cứu rollback.
   - Sử dụng **Rebase and Merge** nếu muốn giữ nguyên chuỗi commit chi tiết có giá trị nghiên cứu.

---

## ⚡ 5. Xử lý Xung đột Mã nguồn (Merge Conflicts)

Khi xảy ra conflict giữa nhánh của bạn và nhánh `develop`:
```bash
# 1. Chuyển về nhánh của bạn
git checkout feature/your-branch

# 2. Rebase với nhánh develop mới nhất
git fetch origin
git rebase origin/develop

# 3. Mở VSCode / Antigravity IDE, chọn giữ lại code chính xác (Current Change vs Incoming Change)
# 4. Sau khi giải quyết xong tất cả các file có conflict:
git add .
git rebase --continue

# 5. Push cập nhật lên remote (yêu cầu force-with-lease an toàn)
git push origin feature/your-branch --force-with-lease
```
