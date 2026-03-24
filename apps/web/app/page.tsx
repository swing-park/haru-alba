import Link from 'next/link';
import Navbar from '@/components/common/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* 히어로 섹션 */}
        <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">퇴근길에 10만원 벌고 가기</h1>
            <p className="text-orange-100 text-lg mb-8">
              이력서 없이, 면접 없이, 지원 즉시 확정.<br />
              초단기 부수입 전용 매칭 플랫폼
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/jobs"
                className="bg-white text-orange-500 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition"
              >
                알바 찾기
              </Link>
              <Link
                href="/signup?type=employer"
                className="border-2 border-white text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition"
              >
                인력 구하기
              </Link>
            </div>
          </div>
        </section>

        {/* 특징 섹션 */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-slate-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12 text-gray-800 dark:text-slate-100">
              하루알바가 다른 이유
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { emoji: '⚡', title: '즉시 확정', desc: '지원하면 구인자가 바로 확정. 기다림 없이 오늘 바로 일하세요.' },
                { emoji: '📄', title: '이력서 없음', desc: '복잡한 이력서, 자기소개서 필요 없어요. 프로필만 있으면 OK.' },
                { emoji: '💰', title: '당일 부수입', desc: '퇴근 후 2~4시간으로 부수입을 만드세요.' },
              ].map((item) => (
                <div key={item.title} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm text-center">
                  <div className="text-4xl mb-4">{item.emoji}</div>
                  <h3 className="font-bold text-lg mb-2 dark:text-slate-100">{item.title}</h3>
                  <p className="text-gray-600 dark:text-slate-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 text-center dark:bg-slate-950">
          <h2 className="text-2xl font-bold mb-4 dark:text-slate-100">오늘 공고가 올라왔어요</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-8">지금 바로 확인하고 지원해보세요</p>
          <Link
            href="/jobs"
            className="bg-orange-500 text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-orange-600 transition"
          >
            공고 보러가기 →
          </Link>
        </section>
      </main>
    </>
  );
}
