import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Faq: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mt-4"
    >
      <main className=" mt-6">
        <ul className=" mt-2 px-4">
          <section className=" mb-[20px]">
            <li className=" text-[#7F7F81] dark:text-gray-200 text-sm font-semibold list-decimal leading-[173%]">
              What is Wano?
            </li>
            <ul>
              <li className=" text-sm font-normal list-disc text-[#7F7F81] leading-[173%]">
                Wano is a reliable customer support assistant that helps you
                automate 60% of your support operations, responds to customers
                instantly and automatically resolves issues in real-time, based
                solely on your entire support content. Think of Wano as the
                intelligent customer support platform designed for fast growing
                companies.
              </li>
            </ul>
          </section>
          <section className=" mb-[20px]">
            <li className=" text-[#7F7F81] dark:text-gray-200 text-sm font-semibold list-decimal leading-[173%]">
              How does pricing work
            </li>
            <p className=" text-sm font-normal list-disc text-[#7F7F81] ml-[-16px] leading-[173%]">
              You can choose to Pay as you go at $0.2 Credits ($0.2) per
              resolution or commit to our flexible subscription plan if you want
              to scale with access to more features and a lower price:
            </p>
            <ul className=" text-sm font-normal list-disc text-[#7F7F81] leading-[173%]">
              <span className="ml-[-16px] ">
                a. Early Explorer (For early explorers) Price: $0/month
              </span>
              <li className="ml-[16px]">
                Features include : 2 team members/seats, 1 business and $0.20
                per task
              </li>
              <span className="ml-[-16px]">
                b. Team (For teams needing more collaboration) Price: $99/month
              </span>
              <li className="ml-[16px]">
                Features include: 5 users/seats, Third-party app integration,
                Setup assistance (once monthly), 1 business, and $0.15 per task
              </li>
              <span className="ml-[-16px]">
                c. Business (For growing teams) Price: $499/month
              </span>
              <li className="ml-[16px]">
                Features include: 25 users/seats, access to Third-party app
                integration, Setup assistance (four times a month/once weekly),
                3 businesses, and $0.1 per task
              </li>
              <span className="ml-[-16px]">
                d. Enterprise (For teams operating at scale) Price: Custom
                pricing
              </span>
              <li className="ml-[16px]">
                Features include: Unlimited users/seats, Third-party app
                integration, Custom app integration, Daily setup assistance,
                Volume-based discounts (up to 50%), Advanced customization,
                Unlimited support, Dedicated account manager, Dedicated server,
                Wano partner program (up to $5000 Wano credits for your
                customers). Simply{" "}
                <Link to="" className=" underline text-sm ">
                  Contact us
                </Link>{" "}
                to get started with enterprise pricing.
              </li>
            </ul>
          </section>
          <section className=" mb-[20px]">
            <li className=" text-[#7F7F81] dark:text-gray-200 text-sm font-semibold list-decimal leading-[173%]">
              What services does Wano offer?
            </li>
            <ul>
              <p className="text-sm font-normal text-[#7F7F81]">
                Wano has 2 service offerings:
              </p>
              <li className=" text-sm font-normal list-disc text-[#7F7F81] leading-[173%]">
                An AI customer support assistant that helps your support team
                respond to customers 24/7, resolve millions of support tickets
                every hour in real-time, and so much more.
              </li>
              <li className=" text-sm font-normal list-disc text-[#7F7F81] leading-[173%]">
                Customer support tool that provides your business a secure
                platform communicate with customers, gain deep insights into
                every conversations, and a shared inbox to keep an eye on your
                team, support assistant, tickets and customer data.
              </li>
            </ul>
          </section>
          <section className=" mb-[20px]">
            <li className=" text-[#7F7F81] dark:text-gray-200 text-sm font-semibold list-decimal leading-[173%]">
              Where can I use my support Assistant?
            </li>
            <ul>
              <li className=" text-sm font-normal list-disc text-[#7F7F81] leading-[173%]">
                You can connect your support assistants to your website, mobile
                app or any web application by embedding our powerful chat
                widget, no coding required.
              </li>
            </ul>
          </section>
          <section className=" mb-[20px]">
            <li className=" text-[#7F7F81] dark:text-gray-200 text-sm font-semibold list-decimal leading-[173%]">
              How can My Support Assistants improve my customer support
              operations?
            </li>
            <ul>
              <li className=" text-sm font-normal list-disc text-[#7F7F81] leading-[173%]">
                Your support Assistants is designed to resolve millions of
                customer inquiries, requests and complaints using safe and
                reliable human-like responses that are solely based on your
                support content. Furthermore, your assistant can intelligently
                identify issues that it can’t resolve, and quickly routes them
                to a member of your support team, ensuring that your team is
                focused on the most critical customer issues. Ultimately using
                support assistants will enhance the performance of your customer
                support service, increase productivity of your support team,
                increase customer satisfaction, reduce churn rate and save
                significant cost to your business operations.
              </li>
            </ul>
          </section>
          <section className=" mb-[20px]">
            <li className=" text-[#7F7F81] dark:text-gray-200 text-sm font-semibold list-decimal leading-[173%]">
              Is my data secure when using Wano's services?
            </li>
            <ul>
              <li className=" text-sm font-normal list-disc text-[#7F7F81] leading-[173%]">
                Wano takes data security seriously. We implement robust security
                measures to ensure that we protect your data and do not share it
                with any third-party without your authorisation.
              </li>
              <li className=" text-sm font-normal list-disc text-[#7F7F81] leading-[173%]">
                Businesses can optionally host their own assistants on private
                servers and store their data locally through our enterprise
                plan.
              </li>
            </ul>
          </section>
          <section className=" mb-[20px]">
            <li className=" text-[#7F7F81] dark:text-gray-200 text-sm font-semibold list-decimal leading-[173%]">
              Is Wano suitable for small businesses, or is it designed for
              larger enterprises only?
            </li>
            <ul>
              <li className=" text-sm font-normal list-disc text-[#7F7F81] leading-[173%]">
                Wano is suitable for businesses of all sizes, from SME’s to
                startups to large enterprises. Our platform is designed to be
                accessible and beneficial to a wide range of companies.
              </li>
            </ul>
          </section>
        </ul>
      </main>
    </motion.div>
  );
};

export default React.memo(Faq);
