export function Home(): JSX.Element | null {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'React DevUI';
  }, []);

  return (
    <main className="app-home-route">
      <section className="app-home-route__page">
        <Bg className="app-home-route__bg" />
        <div className="app-home-route__title">React DevUI</div>
        <div className="app-home-route__description">{t('home.Title')}</div>
        <Link className="app-home-route__button-link" to="/docs/GettingStarted">
          <DButton dIcon={<ArrowRightOutlined />} dIconRight>
            {t('home.Getting Started')}
          </DButton>
        </Link>
      </section>
      <AppFooter />
    </main>
  );
}

export default Home;
