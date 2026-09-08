import Link from 'next/link';
import styles from './page.module.css';
import HeroDemoCard from './components/HeroDemoCard';

export default function Home() {
  return (
    <div className={styles.pageWrapper}>
      
      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <Link href="/" className={styles.navLogo}>
          <div className={styles.navLogoIcon}>⭐</div>
          <span>RatingApp</span>
        </Link>
        <div className={styles.navLinks}>
          <Link href="#features" className={styles.navLink}>Features</Link>
          <Link href="#showcase" className={styles.navLink}>Live Demo</Link>
          <Link href="#roles" className={styles.navLink}>Role Governance</Link>
          <Link href="/login" className={styles.navLink}>Sign In</Link>
        </div>
        <div className={styles.navActions}>
          <Link href="/dashboard" className={styles.getStartedBtn}>
            Launch App ✨
          </Link>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <span className={styles.badgeHighlight}>RatingApp 2.0</span>
              <span>Enterprise Store Rating Engine</span>
            </div>

            <h1 className={styles.title}>
              <span className={styles.titleGradient}>Rate Stores with Transparency.</span>
              <br />
              <span className={styles.titleAccent}>Manage with Authority.</span>
            </h1>

            <p className={styles.tagline}>
              The next-generation store review ecosystem. Empower customers to rate stores from 1 to 5 stars, enable store owners to monitor real-time satisfaction, and grant administrators complete governance.
            </p>

            <div className={styles.heroActions}>
              <Link href="/dashboard" className={styles.btnPrimary}>
                Explore Stores Dashboard ⭐
              </Link>
              <Link href="/register" className={styles.btnSecondary}>
                Create Account 🚀
              </Link>
            </div>

            {/* Metrics Trust Strip */}
            <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #E2E8F0', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>4.9 / 5.0</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Customer Satisfaction</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4F46E5' }}>3 Roles</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Admin, Owner, Customer</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0D9488' }}>100%</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Prisma & NextAuth Secured</div>
              </div>
            </div>
          </div>

          {/* Interactive Hero Widget */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <HeroDemoCard />
          </div>
        </section>

        {/* Live Store Showcase Grid */}
        <section id="showcase" style={{ padding: '5rem 5%', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
          <div className={styles.sectionHeader}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: '#4F46E5', background: '#EEF2FF', padding: '0.3rem 0.8rem', borderRadius: '99px', display: 'inline-block', marginBottom: '0.75rem' }}>
              Live Store Directory
            </span>
            <h2 className={styles.sectionTitle}>Top Rated Registered Stores</h2>
            <p className={styles.tagline} style={{ margin: '0 auto' }}>
              Explore real-time store profiles, average ratings, and customer reviews.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {[
              { name: 'Apex Tech Superstore', category: 'Electronics & Gadgets', rating: '4.9 ★', reviews: '342 Reviews', owner: 'Alex Mercer', icon: '💻', badge: 'Top Rated', badgeBg: '#EEF2FF', badgeColor: '#4F46E5' },
              { name: 'Artisan Coffee Roasters', category: 'Café & Bakery', rating: '4.8 ★', reviews: '215 Reviews', owner: 'Elena Rostova', icon: '☕', badge: 'Trending', badgeBg: '#F0FDF4', badgeColor: '#059669' },
              { name: 'Urban Threads Boutique', category: 'Fashion & Apparel', rating: '4.7 ★', reviews: '189 Reviews', owner: 'Marcus Vance', icon: '🛍️', badge: 'Popular', badgeBg: '#F3E8FF', badgeColor: '#7C3AED' }
            ].map((store, i) => (
              <div key={i} style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '20px',
                padding: '2rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2.5rem' }}>{store.icon}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, background: store.badgeBg, color: store.badgeColor, padding: '0.25rem 0.65rem', borderRadius: '99px', border: `1px solid ${store.badgeBg}` }}>
                      {store.badge}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>{store.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>{store.category}</p>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>{store.rating}</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>{store.reviews}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#0D9488', fontWeight: 700, textAlign: 'right' }}>
                    Owner: {store.owner}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Roles & Feature Bento Grid */}
        <section id="roles" className={styles.featuresSection}>
          <div className={styles.sectionHeader}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: '#0D9488', background: '#CCFBF1', padding: '0.3rem 0.8rem', borderRadius: '99px', display: 'inline-block', marginBottom: '0.75rem' }}>
              Role Architecture
            </span>
            <h2 className={styles.sectionTitle}>3 Roles, 1 Seamless Platform</h2>
            <p className={styles.tagline} style={{ margin: '0 auto' }}>
              Architected with strict access control and tailored user interfaces.
            </p>
          </div>

          <div className={styles.bentoGrid}>
            <div className={`${styles.bentoCard} ${styles.bentoLarge}`} style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #EEF2FF 100%)' }}>
              <div className={styles.featureIconWrapper} style={{ background: '#EEF2FF', borderColor: '#C7D2FE', color: '#4F46E5' }}>⭐</div>
              <h3 className={styles.featureTitle}>1-to-5 Star Customer Ratings</h3>
              <p className={styles.featureDesc}>
                Customers can search registered stores, submit 1 to 5 star ratings, modify their ratings anytime, and sort stores by average score or name.
              </p>
            </div>

            <div className={styles.bentoCard} style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F3E8FF 100%)' }}>
              <div className={styles.featureIconWrapper} style={{ background: '#F3E8FF', borderColor: '#E9D5FF', color: '#7C3AED' }}>👑</div>
              <h3 className={styles.featureTitle}>Admin Governance</h3>
              <p className={styles.featureDesc}>
                Full platform oversight. Create users, assign roles (Admin, Store Owner, User), add new store profiles, inspect system stats, and delete records.
              </p>
            </div>

            <div className={styles.bentoCard} style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%)' }}>
              <div className={styles.featureIconWrapper} style={{ background: '#F0FDF4', borderColor: '#BBF7D0', color: '#059669' }}>🏪</div>
              <h3 className={styles.featureTitle}>Store Owner Portal</h3>
              <p className={styles.featureDesc}>
                Store owners access a dedicated dashboard to monitor customer satisfaction scores, inspect raters, and analyze average ratings.
              </p>
            </div>

            <div className={`${styles.bentoCard} ${styles.bentoLarge}`} style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFBEB 100%)' }}>
              <div className={styles.featureIconWrapper} style={{ background: '#FFFBEB', borderColor: '#FDE68A', color: '#D97706' }}>🔒</div>
              <h3 className={styles.featureTitle}>Enterprise Authentication & Security</h3>
              <p className={styles.featureDesc}>
                Powered by NextAuth credentials, Prisma ORM PostgreSQL schema, real-time client & server password validation, and secure password reset tokens.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Bottom Banner */}
        <section style={{ padding: '6rem 5%', textAlign: 'center', background: 'linear-gradient(135deg, #4F46E5 0%, #2563EB 50%, #0D9488 100%)', color: 'white' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to Experience Next-Gen Rating Governance?</h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2.5rem' }}>
              Sign in with one of our demo accounts or register a new account in seconds.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/login" style={{ padding: '1rem 2.5rem', background: '#FFFFFF', color: '#0F172A', fontWeight: 800, borderRadius: '12px', textDecoration: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                Sign In Now →
              </Link>
              <Link href="/register" style={{ padding: '1rem 2.5rem', background: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 800, borderRadius: '12px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' }}>
                Register Account
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <div className={styles.navLogoIcon} style={{ width: '28px', height: '28px', fontSize: '0.9rem' }}>⭐</div>
            <span>RatingApp</span>
          </div>
          <div className={styles.footerLinks}>
            <Link href="/dashboard" className={styles.footerLink}>Dashboard</Link>
            <Link href="/login" className={styles.footerLink}>Sign In</Link>
            <Link href="/register" className={styles.footerLink}>Register</Link>
          </div>
        </div>
        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} RatingApp. Built with Next.js 15 & Prisma ORM.
        </div>
      </footer>
    </div>
  );
}
