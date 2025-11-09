import CardClassifica from "../components/CardClassifica";
import HomeCarouselDeiPoveri from "../components/HomeCarouselDeiPoveri";
function Home() {
  return <div className="flex flex-col justify-center items-center xl:mx-40">
    <section className="my-8">
    <HomeCarouselDeiPoveri/>
    </section>

    <section className="flex flex-col gap-5 justify-center items-center py-10">
     <CardClassifica link={'/serie-a'}/>
     <CardClassifica/>
     <CardClassifica/>
     <CardClassifica/>
    </section>
 
  </div>;
}

export default Home;
