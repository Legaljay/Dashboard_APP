import React from 'react';
import { useModal } from '@/contexts/ModalContext';
import { Modal, ConfirmModal } from '@/components/ui/modal/Modal';
import { MultiStepModal } from '@/components/ui/modal/MultiStepModal';
import { useModalChain } from '@/hooks/useModalChain';
import { MODAL_IDS } from '@/constants/modalIds';
import { z } from 'zod';
import { Form } from '@/components/ui/form/Form';

// Form schemas for each step
const personalInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

const additionalInfoSchema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
});

type PersonalInfoData = z.infer<typeof personalInfoSchema>;
type AdditionalInfoData = z.infer<typeof additionalInfoSchema>;

// Example step components for multi-step form
const PersonalInfo: React.FC<any> = ({ onNext, formData }) => {
  const handleSubmit = (data: PersonalInfoData) => {
    onNext(data);
  };

  return (
    <Form
      schema={personalInfoSchema}
      onSubmit={handleSubmit}
      defaultValues={formData}
      submitLabel="Next"
      fields={[
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          placeholder: 'Enter your name',
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'Enter your email',
        },
      ]}
    />
  );
};

const AdditionalInfo: React.FC<any> = ({ onNext, onBack, formData }) => {
  const handleSubmit = (data: AdditionalInfoData) => {
    onNext(data);
  };

  return (
    <Form
      schema={additionalInfoSchema}
      onSubmit={handleSubmit}
      defaultValues={formData}
      submitLabel="Next"
      fields={[
        {
          name: 'phone',
          label: 'Phone',
          type: 'tel',
          placeholder: 'Enter your phone number',
        },
        {
          name: 'address',
          label: 'Address',
          type: 'textarea',
          placeholder: 'Enter your address',
        },
      ]}
      renderFooter={() => (
        <div className="mt-4">
          <button
            type="button"
            onClick={onBack}
            className="w-full px-4 py-2 mt-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      )}
    />
  );
};

const Review: React.FC<any> = ({ formData, onBack, onNext }) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-gray-900">Personal Information</h4>
        <dl className="mt-2 space-y-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="text-sm text-gray-900">{formData.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="text-sm text-gray-900">{formData.email}</dd>
          </div>
        </dl>
      </div>
      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-gray-900">Additional Information</h4>
        <dl className="mt-2 space-y-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Phone</dt>
            <dd className="text-sm text-gray-900">{formData.phone}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Address</dt>
            <dd className="text-sm text-gray-900">{formData.address}</dd>
          </div>
        </dl>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={() => onNext(formData)}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export const ModalExamples: React.FC = () => {
  const { openModal, closeModal } = useModal();
  const modalChain = useModalChain();

  // Example of multi-step form modal
  const handleOpenMultiStepModal = () => {
    openModal(
      MODAL_IDS.custom('multi-step'),
      <MultiStepModal
        steps={[
          {
            title: 'Personal Information',
            component: <PersonalInfo />,
            description: 'Basic details'
          },
          {
            title: 'Additional Information',
            component: <AdditionalInfo />,
            description: 'Contact info'
          },
          {
            title: 'Review',
            component: <Review />,
            description: 'Verify details'
          }
        ]}
        onClose={() => closeModal(MODAL_IDS.custom('multi-step'))}
        onComplete={(data) => {
          console.log('Form completed:', data);
          closeModal(MODAL_IDS.custom('multi-step'));
        }}
      />
    );
  };

  // Example of chained modals
  const handleStartModalChain = () => {
    const steps = [
      {
        id: MODAL_IDS.custom('chain-1'),
        component: (
          <Modal title="First Modal" onClose={() => modalChain.closeChain()}>
            <Modal.Body>
              <p>This is the first modal in the chain.</p>
            </Modal.Body>
            <Modal.Footer>
              <button
                onClick={() => {
                  console.log('Next button clicked in first modal');
                  modalChain.nextInChain();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Next Modal
              </button>
            </Modal.Footer>
          </Modal>
        )
      },
      {
        id: MODAL_IDS.custom('chain-2'),
        component: (
          <Modal title="Second Modal" onClose={() => modalChain.closeChain()}>
            <Modal.Body>
              <p>This is the second modal in the chain.</p>
            </Modal.Body>
            <Modal.Footer>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    console.log('Previous button clicked in second modal');
                    modalChain.previousInChain();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    console.log('Next button clicked in second modal');
                    modalChain.nextInChain();
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            </Modal.Footer>
          </Modal>
        )
      },
      {
        id: MODAL_IDS.custom('chain-3'),
        component: (
          <ConfirmModal
            title="Final Step"
            message="Would you like to complete this process?"
            onConfirm={() => {
              console.log('Confirm clicked in final modal');
              modalChain.closeChain();
            }}
            onCancel={() => {
              console.log('Back clicked in final modal');
              modalChain.previousInChain();
            }}
            confirmText="Complete"
            cancelText="Back"
            type="info"
          />
        )
      }
    ];

    console.log('Starting modal chain with steps:', steps);
    modalChain.startChain(steps);
  };

  return (
    <div className="space-y-4 space-x-4">
      <button
        onClick={handleOpenMultiStepModal}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Open Multi-Step Form
      </button>
      <button
        onClick={handleStartModalChain}
        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
      >
        Start Modal Chain
      </button>
    </div>
  );
};


// Example step components for multi-step form without Form component
const PersonalInfos: React.FC<any> = ({ onNext, formData }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      name: (e.target as any).name.value,
      email: (e.target as any).email.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          defaultValue={formData.name}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          defaultValue={formData.email}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Next
      </button>
    </form>
  );
};

const AdditionalInfos: React.FC<any> = ({ onNext, onBack, formData }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      phone: (e.target as any).phone.value,
      address: (e.target as any).address.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          name="phone"
          defaultValue={formData.phone}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <textarea
          name="address"
          defaultValue={formData.address}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </form>
  );
};

const Reviews: React.FC<any> = ({ formData, onBack, onNext }) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-gray-900">Personal Information</h4>
        <dl className="mt-2 space-y-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="text-sm text-gray-900">{formData.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="text-sm text-gray-900">{formData.email}</dd>
          </div>
        </dl>
      </div>
      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-gray-900">Additional Information</h4>
        <dl className="mt-2 space-y-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Phone</dt>
            <dd className="text-sm text-gray-900">{formData.phone}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Address</dt>
            <dd className="text-sm text-gray-900">{formData.address}</dd>
          </div>
        </dl>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={() => onNext(formData)}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};
