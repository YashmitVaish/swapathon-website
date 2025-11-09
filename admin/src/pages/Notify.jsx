import React, { useState } from 'react'

const Notify = () => {
  const [heading,setHeading] = useState('');
  const [message,setMessage] = useState('');
  const [error,setError] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/notfy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heading, message }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Notification failed')
        return
      }

      alert('Notification sent successfully');

    } catch (err) {
      setError('Network error')
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Send Notification</h1>
      <p>Send a notification to all users</p>
    </div>
  )
}

export default Notify