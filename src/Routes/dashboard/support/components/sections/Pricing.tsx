import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Pricing: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mt-4"
    >
      <main className=" mt-6">
        <p className="text-[#7F7F81] text-sm font-normal">
          At Wano, we offer a flexible subscription model. Our pricing structure
          is designed to be transparent and accessible for businesses of all
          sizes. Here's an overview of how it works:
        </p>
        <ul className=" mt-[28px] px-4">
          <section>
            <li className=" text-[#292D32] dark:text-gray-200 text-sm font-normal list-decimal leading-[173%] ">
              Early Explorer (For early explorers){" "}
              <span className="text-[#7F7F81]">Price: $0/month</span>
            </li>
            <ul className="pl-4">
              <li className=" text-sm font-normal list-disc text-[#7F7F81] leading-[173%]">
                Features include : 2 team members/seats, 1 business and $0.20
                per resolution
              </li>
            </ul>
          </section>
          <section>
            <li className=" text-[#292D32] dark:text-gray-200 text-sm font-normal list-decimal leading-[173%] ">
              Team (For teams needing more collaboration){" "}
              <span className="text-[#7F7F81]">Price: $99/month</span>
            </li>
            <ul className="pl-4">
              <li className=" text-sm font-normal list-disc text-[#7F7F81] leading-[173%]">
                Features include: 5 users/seats, Third-party app integration,
                Setup assistance (once monthly), 1 business, and $0.15 per
                resolution
              </li>
            </ul>
          </section>
          <section>
            <li className=" text-[#292D32] dark:text-gray-200 text-sm font-normal list-decimal leading-[173%] ">
              Business (For growing teams)
              <span className="text-[#7F7F81]">Price: $499/month</span>
            </li>
            <ul className="pl-4">
              <li className=" text-sm font-normal list-disc text-[#7F7F81] leading-[173%]">
                Features include: 25 users/seats, access to Third-party app
                integration, Setup assistance (four times a month/once weekly),
                3 businesses, and $0.1 per task
              </li>
            </ul>
          </section>
          <section>
            <li className=" text-[#292D32] dark:text-gray-200 text-sm font-normal list-decimal leading-[173%]">
              Enterprise (For teams operating at scale){" "}
              <span className="text-[#7F7F81]">Price: Custom pricing</span>
            </li>
            <ul className="pl-4">
              <li className=" text-sm font-normal list-disc text-[#7F7F81] leading-[173%]">
                {" "}
                Features include: Unlimited users/seats, Third-party app
                integration, Custom app integration, Daily setup assistance,
                Volume-based discounts (up to 50%), Advanced customization,
                Unlimited support, Dedicated account manager, Dedicated server,
                Wano partner program (up to $5000 Wano credits for your
                customers).{" "}
              </li>
              <Link to="" className=" underline text-[#1774FD] text-sm ">
                Contact us
              </Link>{" "}
              <span className=" text-sm font-normal list-disc text-[#7F7F81] leading-[173%]">
                to get started with enterprise pricing.
              </span>
            </ul>
          </section>
        </ul>

        <section>
          <p className=" text-[#292D32] dark:text-gray-200 text-sm font-normal my-7">
            How to Purchase Credits:{" "}
            <span className="text-sm font-normal text-[#7F7F81]">
              To purchase credits, simply log in to your Wano account and visit
              the{" "}
              <Link to="/top-up" className=" underline text-[#1774FD] ">
                Billings
              </Link>{" "}
              section. There, you can decide to top up your credits as needed or
              contact us to hear about our Enterprise pricing. The minimum
              funding amount afterwards is $5 (5 credits)
            </span>
          </p>
        </section>
        <section>
          <p className=" text-[#7F7F81] dark:text-gray-200 text-sm font-normal">
            Please note:{" "}
            <span className="text-sm font-normal text-[#7F7F81] dark:text-gray-200">
              As a new user, you get $5 free credits when you first sign up on
              Wano.
            </span>
          </p>
          <p className="text-sm font-normal text-[#7F7F81] dark:text-gray-200">
            If you have any questions about our pricing or need assistance with
            your billing, please feel free to{" "}
            <a
              href="mailto:Support@wano.app"
              className=" underline lowercase text-[#1774FD] "
            >
              contact our support team
            </a>{" "}
            for further guidance.
          </p>
        </section>
      </main>
    </motion.div>
  );
};

export default React.memo(Pricing);
