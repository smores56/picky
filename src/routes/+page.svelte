<script>
  import Footer from "$lib/components/Footer.svelte";
</script>

<svelte:head>
  <title>Picky</title>

  <!--
  <link href="assets/vendor/aos/aos.css" rel="stylesheet" />
  <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
  <link href="assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet" />
  <link href="assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet" />
  <link href="assets/vendor/remixicon/remixicon.css" rel="stylesheet" />
  <link href="assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet" />
  -->
</svelte:head>

<header class="fixed-top d-flex align-items-center header-transparent" id="header">
  <div class="container d-flex align-items-center justify-content-between">
    <div class="logo">
      <a href="index.html">
        <img alt="" class="img-fluid" src="/logo.png" />
      </a>
    </div>

    <nav class="navbar" id="navbar">
      <ul>
        <li><a class="nav-link scrollto active" href="#hero">Home</a></li>
        <li><a class="nav-link scrollto" href="#about">About</a></li>
        <li><a class="nav-link scrollto" href="#team">Team</a></li>
        <li><a class="nav-link scrollto" href="#contact">Contact</a></li>
      </ul>
    </nav>
  </div>
</header>

<section id="hero">
  <div class="container">
    <div class="row justify-content-between">
      <div class="col-lg-6 pt-5 pt-lg-0 order-2 order-lg-1 d-flex align-items-center">
        <div data-aos="zoom-out">
          <img alt="" class="img-fluid" src="logo.png" style="width: 16%;" />
          <h1>
            In store pickup<br />
            made <span>simple</span>
          </h1>

          <h2>We make in store pick-up easy...</h2>

          <div class="cus_search">
            <div class="col-lg-12 col-md-10 footer-newsletter">
              <form action="" method="post">
                <input name="email" placeholder="Picky..." type="email" /><input
                  type="submit"
                  value="Search"
                />
              </form>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6 order-1 order-lg-2 hero-img" data-aos="zoom-out" data-aos-delay="300">
        <img alt="" class="img-fluid animated" src="/map.png" />
      </div>
    </div>
  </div>
  <svg class="hero-waves" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <path
        d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        id="wave-path"
      /></defs
    >
    <g class="wave1"> <use fill="rgba(255,255,255, .1)" x="50" xlink:href="#wave-path" y="3" /></g>
    <g class="wave2"> <use fill="rgba(255,255,255, .2)" x="50" xlink:href="#wave-path" y="0" /></g>
    <g class="wave3"> <use fill="#fff" x="50" xlink:href="#wave-path" y="9" /></g>
  </svg>
</section>

<main id="main">
  <!-- ======= About Section ======= -->
  <section class="about" id="about">
    <div class="container-fluid">
      <div class="row">
        <div
          class="col-xl-6 col-lg-6 icon-boxes d-flex flex-column align-items-stretch justify-content-center py-5 px-lg-5"
          data-aos="fade-left"
        >
          <div class="section-title aos-init aos-animate" data-aos="fade-up">
            <h2>About Picky</h2>

            <p>What We Do</p>
          </div>

          <p>
            At Picky, we understand the importance of providing seamless and convenient experiences
            for digital native brands and retailers. That&#39;s why we&#39;re dedicated to making
            local pickup hassle-free and efficient, all while ensuring excellent customer service.
          </p>

          <p>
            Our mission is to empower digital brands to offer local pickup options that align with
            their brand identity and meet their customers&#39; expectations. By leveraging our
            expertise and network of brand-appropriate locations, we streamline the pickup process
            and create a positive customer experience from start to finish.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section class="counts" id="counts">
    <div class="container">
      <div class="section-title" data-aos="fade-up">
        <h2>Picky&#39;s</h2>

        <p>Picky&#39;s Pickup Platform</p>
      </div>

      <div class="row" data-aos="fade-up">
        <div class="col-lg-4 col-md-6">
          <div class="count-box">
            <img alt="" class="img-fluid" src="/one.png" />
            <h5>Beautiful Locations with Great Staff</h5>

            <ul>
              <li>We vet each pickup location using our Picky Standards</li>
              <li>We audit with secret shoppers to maintain quality standards</li>
            </ul>
          </div>
        </div>

        <div class="col-lg-4 col-md-6">
          <div class="count-box">
            <!-- <i class="bi bi-emoji-smile"></i> --><img
              alt=""
              class="img-fluid"
              src="/two.png"
            />
            <h5>Your Local Store That Matches Your Brand</h5>

            <ul>
              <li>We match purchases with relevant pick up locations</li>
              <li>No picking up a new dress at a tire shop</li>
            </ul>
          </div>
        </div>

        <div class="col-lg-4 col-md-6">
          <div class="count-box">
            <!-- <i class="bi bi-hand-thumbs-up"></i> --><img
              alt=""
              class="img-fluid"
              src="/three.png"
            />
            <h5>Awesome Customer Support Experience</h5>

            <ul>
              <li>Need to return an item? Picky makes ordering replacements a snap</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="details cus_over1" id="details">
    <div class="container">
      <div class="row content">
        <div class="col-md-6" data-aos="fade-right">
          <img alt="" class="img-fluid" src="/about.png" />
        </div>

        <div class="col-md-6 pt-5 order-2 order-md-1 cus_over_section1" data-aos="fade-up">
          <div class="section-title" data-aos="fade-up">
            <h2>Picky&#39;s</h2>

            <p>Key Features of Picky:</p>
          </div>

          <p>
            Effortless Local Pickup: We take the complexity out of implementing local pickup by
            handling all the logistics and operational aspects. You can focus on your core business
            while we ensure a smooth and seamless pickup process.
          </p>

          <p>
            Brand-Appropriate Locations: We carefully curate a network of pickup locations that
            match the brand image and values of our partners. From trendy boutiques to convenient
            urban hubs, we provide locations that resonate with your target audience.
          </p>
          <br />
          &nbsp;
        </div>
      </div>
    </div>
  </section>

  <section class="details cus_over1" id="details">
    <div class="container">
      <div class="row content">
        <div class="col-md-6 pt-5 cus_over_section1" data-aos="fade-up">
          <div class="section-title" data-aos="fade-up">
            <h2>Picky&#39;s</h2>

            <p>Key Features of Picky:</p>
          </div>

          <p>
            Excellent Customer Service: We prioritize exceptional customer service to enhance the
            overall pickup experience. Our team is dedicated to providing prompt and friendly
            support to both brands and customers, ensuring satisfaction at every step.
          </p>

          <p>
            Seamless Integration: Our platform seamlessly integrates with your existing systems and
            workflows, making it easy to implement and manage local pickup. You can track orders,
            manage inventory, and communicate with customers, all within a unified interface.
          </p>
          <br />
          &nbsp;
        </div>

        <div class="col-md-6" data-aos="fade-right">
          <img alt="" class="img-fluid" src="/right.png" />
        </div>
      </div>
    </div>
  </section>

  <section class="counts cus_form_over" id="counts">
    <div class="container">
      <div class="row" data-aos="fade-up">
        <div class="col-lg-12 col-md-6" style="text-align: center;">
          <h1>
            Create enduring<br />
            memories with Picky.
          </h1>

          <p>
            Discover the Picky difference today and join us in simplifying local pickup for digital
            brands.
          </p>
        </div>
      </div>
    </div>
  </section>
</main>

<Footer />
