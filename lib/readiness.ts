// Readiness copy shared by the showcase home page and the service page.
// One source so both pages always say the same thing about the vertical's status.

export type AgencyStatus = 'incubating' | 'target' | 'locked';

export type ReadinessCopy = Readonly<{ label: string; note: string }>;

export const statusCopy: Readonly<Record<AgencyStatus, ReadinessCopy>> = {
  incubating: {
    label: 'กำลังเปิดรอบ validation',
    note: 'กำลังทดสอบ buyer, offer และ delivery economics ก่อนเปิดรับงานในขอบเขตที่ชัดเจน',
  },
  target: {
    label: 'เตรียมไว้ใน portfolio',
    note: 'positioning พร้อมสำหรับการทดสอบ แต่ owner และหลักฐานการส่งมอบยังต้องผ่าน gate ก่อนเปิดรับงาน',
  },
  locked: {
    label: 'future capability',
    note: 'เก็บไว้สำหรับการวิจัยและวางพันธมิตร ยังไม่มีการรับข้อมูลหรือรับประกันบริการ',
  },
};

export function readinessCopy(status: AgencyStatus): ReadinessCopy {
  return statusCopy[status];
}
