import CardClassifica from '../components/CardClassifica';
import HomeCarouselDeiPoveri from '../components/HomeCarouselDeiPoveri';
import RankingTable from '../components/RankingTable';
import { Link } from 'react-router-dom';
import Splitter from '../components/Splitter';
function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <section className="my-8">
        <HomeCarouselDeiPoveri />
      </section>

      <section className="py-20">
        <Splitter title="Campionati" />
        <div className="flex w-full flex-col items-center justify-center gap-8">
          <CardClassifica title="Serie A" ranking={1} />
          <CardClassifica title="Serie B" ranking={2} />
          <CardClassifica title="Serie C" ranking={3} />
          <CardClassifica title="Serie D" ranking={4} />
        </div>
      </section>

      <section>
        <Splitter title="Coppe" />
        <div className="flex flex-col items-center justify-center gap-8">
          <CardClassifica title="Coppa 1" ranking={1} />
          <CardClassifica title="Coppa 2" ranking={2} />
          <CardClassifica title="Coppa 3" ranking={3} />
        </div>
      </section>
    </div>
  );
}

export default Home;
