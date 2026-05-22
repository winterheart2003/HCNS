# VideoFeed

Ứng dụng xem video dạng cuộn dọc, xây dựng với Next.js 14 (App Router) và TypeScript.

## Tính năng

- Giao diện cuộn dọc full-screen với CSS Scroll Snap
- Video tự động phát/dừng theo viewport
- Click vào video để play/pause
- Nút Like với animation và cập nhật số lượng real-time
- Sidebar navigation (PC) và Bottom navigation (Mobile)
- Responsive: tỉ lệ 9:16 trên PC, full-screen trên mobile

## Logic Play/Pause khi cuộn trang

Ứng dụng sử dụng **Intersection Observer API** để phát hiện video nào đang nằm trong tầm nhìn của người dùng.

**Luồng hoạt động:**

1. `VideoFeed` khởi tạo một `IntersectionObserver` với `threshold: 0.6`, nghĩa là khi một video slide chiếm ít nhất 60% diện tích màn hình, Observer sẽ kích hoạt callback.

2. Khi callback kích hoạt, component đọc `data-id` từ phần tử đang intersect và cập nhật state `activeId`.

3. Mỗi `VideoCard` nhận prop `isActive`. Bên trong một `useEffect` theo dõi `isActive`:
   - Nếu `isActive === true` → gọi `video.play()`
   - Nếu `isActive === false` → gọi `video.pause()`

4. CSS `scroll-snap-type: y mandatory` kết hợp `scroll-snap-align: start` đảm bảo mỗi lần cuộn sẽ dừng chính xác tại một video.

**Kết quả:** Video đang xem tự phát, video bị cuộn qua tự dừng — không cần event listener phức tạp, hiệu năng cao nhờ Observer chạy ngoài main thread.

## Cài đặt & Chạy

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

## Deploy

Đẩy lên GitHub và kết nối với Vercel. Project sẽ tự build và deploy.
