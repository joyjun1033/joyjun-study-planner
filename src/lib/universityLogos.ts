/**
 * 대학 이름 → 공식 도메인. 로고는 파비콘 서비스로 도메인에서 바로 가져온다.
 * (직접 입력한 학교처럼 매핑이 없으면 로고를 표시하지 않는다)
 */
const UNIVERSITY_DOMAINS: Record<string, string> = {
  서울대학교: "snu.ac.kr",
  연세대학교: "yonsei.ac.kr",
  고려대학교: "korea.ac.kr",
  서강대학교: "sogang.ac.kr",
  성균관대학교: "skku.edu",
  한양대학교: "hanyang.ac.kr",
  중앙대학교: "cau.ac.kr",
  경희대학교: "khu.ac.kr",
  한국외국어대학교: "hufs.ac.kr",
  서울시립대학교: "uos.ac.kr",
  건국대학교: "konkuk.ac.kr",
  동국대학교: "dongguk.edu",
  홍익대학교: "hongik.ac.kr",
  국민대학교: "kookmin.ac.kr",
  숭실대학교: "ssu.ac.kr",
  세종대학교: "sejong.ac.kr",
  서울과학기술대학교: "seoultech.ac.kr",
  광운대학교: "kw.ac.kr",
  명지대학교: "mju.ac.kr",
  상명대학교: "smu.ac.kr",
  삼육대학교: "syu.ac.kr",
  한성대학교: "hansung.ac.kr",
  서경대학교: "skuniv.ac.kr",
  성신여자대학교: "sungshin.ac.kr",
  숙명여자대학교: "sookmyung.ac.kr",
  이화여자대학교: "ewha.ac.kr",
  동덕여자대학교: "dongduk.ac.kr",
  덕성여자대학교: "duksung.ac.kr",
  서울여자대학교: "swu.ac.kr",
  추계예술대학교: "chugye.ac.kr",
  서울기독대학교: "scu.ac.kr",
  총신대학교: "chongshin.ac.kr",
  장로회신학대학교: "puts.ac.kr",
  한국체육대학교: "knsu.ac.kr",
  한국예술종합학교: "karts.ac.kr",
  육군사관학교: "kma.ac.kr",
  한국방송통신대학교: "knou.ac.kr",
};

export function getUniversityLogoUrl(name: string): string | null {
  const domain = UNIVERSITY_DOMAINS[name];
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}
