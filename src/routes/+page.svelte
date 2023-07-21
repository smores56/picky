<script lang="ts">
  import { Heading, P, Button, Input, Label, Card, List, Li } from "flowbite-svelte";

  import Footer from "$lib/components/Footer.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
</script>

<svelte:head>
  <title>Picky</title>
</svelte:head>

<Navbar />

<section class="flex flex-row p-12">
  <div class="flex flex-col justify-center w-1/2 min-h-full">
    <Heading
      tag="h1"
      class="mb-4"
      customSize="align-center text-center text-4xl font-extrabold md:text-5xl lg:text-6xl"
    >
      We make in-store pickup <i>easy</i>.
    </Heading>

    <div class="my-6 mr-6">
      <Label for="large-input" class="block mb-2">Zip Code</Label>
      <Input size="lg" type="number" minlength="5" maxlength="5" placeholder="12345" />
      <Button color="primary" class="mt-6 w-full">Find a location</Button>
    </div>
  </div>

  <div class="flex flex-col justify-center w-1/2">
    <img height="100%" src="/map.png" alt="Map graphic" />
  </div>
</section>

<section class="flex flex-row p-12 bg-primary-300">
  <div class="flex flex-col justify-center w-1/2">
    <img height="100%" src="/about2.png" alt="Map graphic" />
  </div>

  <div class="flex flex-col w-1/2 ml-4">
    <Heading tag="h2" class="mb-4" customSize="align-center text-center text-4xl font-extrabold">
      About Picky
    </Heading>

    <P class="mb-4">
      At Picky, we understand the importance of providing seamless and convenient experiences for
      digital native brands and retailers. That's why we're dedicated to making local pickup
      hassle-free and efficient, all while ensuring excellent customer service.
    </P>

    <P>
      Our mission is to empower digital brands to offer local pickup options that align with their
      brand identity and meet their customers' expectations. By leveraging our expertise and network
      of brand-appropriate locations, we streamline the pickup process and create a positive
      customer experience from start to finish.
    </P>
  </div>
</section>

<section class="flex flex-col items-center justify-center p-12">
  <Heading tag="h2" class="mb-4" customSize="align-center text-center text-4xl font-extrabold">
    Our Platform
  </Heading>

  <Card size="md" padding="md" class="my-3">
    <img alt="" class="img-fluid" src="/one.png" width="50px" />
    <h5 class="text-2xl">Beautiful Locations with Great Staff</h5>
    <List list="disc">
      <Li class="text-sm">We vet each pickup location using our Picky Standards</Li>
      <Li class="text-sm">We audit with secret shoppers to maintain quality standards</Li>
    </List>
  </Card>

  <Card size="md" padding="md" class="my-3">
    <img alt="" class="img-fluid" src="/two.png" width="50px" />
    <h5 class="text-2xl">Your Local Store That Matches Your Brand</h5>
    <List list="disc">
      <Li class="text-sm">We match purchases with relevant pick up locations</Li>
      <Li class="text-sm">No picking up a new dress at a tire shop</Li>
    </List>
  </Card>

  <Card size="md" padding="md" class="my-3">
    <img alt="" class="img-fluid" src="/three.png" width="50px" />
    <h5 class="text-2xl">Awesome Customer Support Experience</h5>
    <List list="disc">
      <Li class="text-sm">Need to return an item? Picky makes ordering replacements a snap</Li>
    </List>
  </Card>
</section>

<section class="flex flex-col p-12 bg-primary-300">
  <Heading tag="h2" class="mb-6" customSize="align-center text-center text-4xl font-extrabold">
    Key Features
  </Heading>

  <div class="flex flex-row mb-6">
    <div class="flex flex-col justify-center w-1/2">
      <img height="100%" src="/left.png" alt="Map graphic" />
    </div>

    <div class="flex flex-col justify-center w-1/2 ml-4">
      <P class="mb-4">
        <b>Effortless Local Pickup:</b>
        We take the complexity out of implementing local pickup by handling all the logistics and operational
        aspects. You can focus on your core business while we ensure a smooth and seamless pickup process.
      </P>
      <P>
        <b>Brand-Appropriate Locations:</b>
        We carefully curate a network of pickup locations that match the brand image and values of our
        partners. From trendy boutiques to convenient urban hubs, we provide locations that resonate
        with your target audience.
      </P>
    </div>
  </div>

  <div class="flex flex-row">
    <div class="flex flex-col justify-center w-1/2 mr-4">
      <P class="mb-4">
        <b>Excellent Customer Service:</b>
        We prioritize exceptional customer service to enhance the overall pickup experience. Our team
        is dedicated to providing prompt and friendly support to both brands and customers, ensuring
        satisfaction at every step.
      </P>
      <P>
        <b>Seamless Integration:</b>
        Our platform seamlessly integrates with your existing systems and workflows, making it easy to
        implement and manage local pickup. You can track orders, manage inventory, and communicate with
        customers, all within a unified interface.
      </P>
    </div>

    <div class="flex flex-col justify-center w-1/2">
      <img height="100%" src="/right.png" alt="Delivery graphic" />
    </div>
  </div>
</section>

<section class="text-center p-12">
  <Heading tag="h2" class="mb-4" customSize="text-3xl font-extrabold">
    Create enduring memories with Picky.
  </Heading>
  <P class="mb-6 text-lg text-center">
    Discover the Picky difference today and join us in simplifying local pickup for digital brands.
  </P>
  <Button color="primary" href="/register">
    Get started
    <svg
      class="ml-2 -mr-1 w-5 h-5"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
        clip-rule="evenodd"
      />
    </svg>
  </Button>
</section>

<Footer />
