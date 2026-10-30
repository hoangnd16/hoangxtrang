/*
 * ===== CẤU HÌNH THIỆP CƯỚI =====
 * Chỉ cần sửa file này để thay đổi toàn bộ nội dung thiệp.
 * Những chỗ đánh dấu TODO là thông tin cần điền lại cho đúng.
 */
window.WEDDING = {
  groom: {
    shortName: "Hoàng",
    fullName: "Doãn Hoàng",
    photo: "assets/images/groom.jpg",
    intro: "Chàng trai trầm tính, thích những buổi chiều yên bình và luôn tin rằng hạnh phúc đến từ những điều giản dị.",
  },
  bride: {
    shortName: "Trang",
    fullName: "Huyền Trang",
    photo: "assets/images/bride.jpg",
    intro: "Cô gái mê ngủ, coi chiếc gối là bạn thân và mỗi giấc ngủ nướng là niềm vui nhỏ.",
  },

  families: {
    groom: {
      label: "Nhà trai",
      father: "Ông Nguyễn Doãn Sơn",
      mother: "Bà Nguyễn Thị Thảo",
      address: "Thôn Sơn Hà, Xã Toàn Lưu, Tỉnh Hà Tĩnh",
    },
    bride: {
      label: "Nhà gái",
      father: "Ông Nguyễn Trọng Quý",
      mother: "Bà Phan Thị Điểm",
      address: "Thôn Bình Tiến, Xã Đức Thịnh, Tỉnh Hà Tĩnh",
    },
  },

  // Sự kiện chính dùng để đếm ngược, hiển thị lịch và ngày trên bìa
  mainEventIndex: 0,
  events: [
    {
      title: "Lễ Thành Hôn",
      host: "Tư gia nhà trai",
      datetime: "2026-11-29T11:00:00+07:00",
      venue: "Tư gia nhà trai",
      address: "Tổ dân phố 03, phường Hà Huy Tập, tỉnh Hà Tĩnh \n (Thôn Liên Hương, xã Thạch Đài cũ)",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=18.325216049431795,105.87375277127698",
      // Bản đồ nhúng ngay trong thiệp. Để trống để ẩn.
      mapEmbed: "https://maps.google.com/maps?q=18.325216049431795,105.87375277127698&z=16&output=embed",
    },
  ],

  // TODO: chỉnh lại giờ cho đúng chương trình thực tế
  timeline: [
    { time: "10:45", title: "Đón khách", note: "Chụp ảnh lưu niệm cùng cô dâu chú rể" },
    { time: "11:00", title: "Lễ thành hôn", note: "Nghi lễ thành hôn tại tư gia nhà trai" },
    { time: "11:15", title: "Khai tiệc", note: "Cùng nâng ly chúc mừng" },
  ],

  quote: {
    text: "Yêu nhau không phải là nhìn nhau, mà là cùng nhau nhìn về một hướng.",
    author: "Antoine de Saint-Exupéry",
  },
  story:
    "Từ hai con người xa lạ, chúng mình đã gặp nhau, thương nhau và cùng đi qua bao mùa nắng mưa. Hôm nay, chúng mình quyết định nắm tay nhau bước sang một chương mới, và thật hạnh phúc nếu có bạn ở đó, chứng kiến khoảnh khắc quan trọng nhất của cuộc đời chúng mình.",

  gallery: Array.from({ length: 14 }, (_, i) => `assets/images/gallery-${String(i + 1).padStart(2, "0")}.jpg`),

  // Mừng cưới. bankId dùng mã ngân hàng của VietQR (vd: VCB, TCB, MB, ACB, BIDV, VPB, HDB...)
  gifts: [
    {
      label: "Mừng cưới chú rể",
      bankId: "TCB",
      bankName: "Techcombank",
      accountNo: "8608200896",
      accountName: "Nguyen Doan Hoang",
    },
    {
      label: "Mừng cưới cô dâu",
      bankId: "TCB",
      bankName: "Techcombank",
      accountNo: "19072561365018",
      accountName: "Nguyen Thi Huyen Trang",
    },
  ],

  // Nhạc nền: đặt file mp3 vào assets/ rồi điền đường dẫn, vd "assets/music.mp3". Để trống để ẩn nút nhạc.
  music: "assets/music.mp3",

  // Lưu xác nhận tham dự & lời chúc vào Google Sheets: xem hướng dẫn trong README.md.
  // Để trống thì lời chúc chỉ lưu trên trình duyệt của khách.
  rsvpEndpoint: "https://script.google.com/macros/s/AKfycbwdRzg1jWdqbG1smuO-xjdkSG4TOyTX9svfx-J1yDTT_HlIRaPN3z0NivDDuSevjLG9AQ/exec",
};
