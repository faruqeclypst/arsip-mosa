<template>
  <div>
    <!-- Header Section -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Surat Masuk</h1>
        <p class="mt-2 text-sm text-gray-700">Kelola data surat masuk</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button
          @click="dialog = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <i class="fas fa-plus -ml-1 mr-2"></i>
          Tambah Surat
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-white shadow-sm rounded-lg">
      <!-- Search and Filter -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <label class="sr-only">Search</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-search text-gray-400"></i>
              </div>
              <input
                v-model="search"
                type="text"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Cari surat..."
              />
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click="exportToExcel"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <i class="fas fa-file-excel text-green-600 mr-2"></i>
              Export Excel
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No
              </th>
              <th
                v-for="header in headers"
                :key="header.key"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {{ header.title }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading" class="animate-pulse">
              <td colspan="6" class="px-6 py-4">
                <div class="flex items-center justify-center">
                  <i class="fas fa-circle-notch fa-spin text-primary-600 text-2xl"></i>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredSuratList.length === 0" class="hover:bg-gray-50">
              <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                Tidak ada data surat masuk
              </td>
            </tr>
            <tr
              v-for="(item, index) in filteredSuratList"
              :key="item.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.nomor }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.asal }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ item.perihal }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(item.tanggalSurat) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(item.tanggalDiterima) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.jenisSurat }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.sifatSurat }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.keterangan }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  @click="viewSurat(item)"
                  class="text-primary-600 hover:text-primary-900"
                  title="Lihat"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  @click="editSurat(item)"
                  class="text-blue-600 hover:text-blue-900"
                  title="Edit"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="confirmDelete(item)"
                  class="text-red-600 hover:text-red-900"
                  title="Hapus"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Form Dialog -->
    <div v-if="dialog" class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="dialog = false"></div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="saveSurat">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="space-y-4">
                <!-- Nomor Surat -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Nomor Surat
                  </label>
                  <input
                    v-model="editedItem.nomor"
                    type="text"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Masukkan nomor surat"
                  />
                </div>

                <!-- Asal Surat -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Asal Surat
                  </label>
                  <input
                    v-model="editedItem.asal"
                    type="text"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Masukkan asal surat"
                  />
                </div>

                <!-- Perihal -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Perihal
                  </label>
                  <input
                    v-model="editedItem.perihal"
                    type="text"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Masukkan perihal surat"
                  />
                </div>

                <!-- Tanggal Surat -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Tanggal Surat
                  </label>
                  <input
                    v-model="editedItem.tanggalSurat"
                    type="date"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <!-- Tanggal Diterima -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Tanggal Diterima
                  </label>
                  <input
                    v-model="editedItem.tanggalDiterima"
                    type="date"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <!-- Jenis Surat -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Jenis Surat
                  </label>
                  <select
                    v-model="editedItem.jenisSurat"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="">Pilih Jenis Surat</option>
                    <option value="Surat Dinas">Surat Dinas</option>
                    <option value="Surat Undangan">Surat Undangan</option>
                    <option value="Surat Edaran">Surat Edaran</option>
                    <option value="Surat Tugas">Surat Tugas</option>
                    <option value="Surat Keputusan">Surat Keputusan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <!-- Sifat Surat -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Sifat Surat
                  </label>
                  <select
                    v-model="editedItem.sifatSurat"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="">Pilih Sifat Surat</option>
                    <option value="Biasa">Biasa</option>
                    <option value="Segera">Segera</option>
                    <option value="Penting">Penting</option>
                    <option value="Rahasia">Rahasia</option>
                    <option value="Sangat Rahasia">Sangat Rahasia</option>
                  </select>
                </div>

                <!-- Keterangan -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Keterangan
                  </label>
                  <textarea
                    v-model="editedItem.keterangan"
                    rows="3"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Tambahkan keterangan jika ada"
                  ></textarea>
                </div>

                <!-- File Upload -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    File Surat
                  </label>
                  <input
                    type="file"
                    @change="handleFileUpload"
                    accept=".pdf,.doc,.docx"
                    class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  <p class="mt-1 text-xs text-gray-500">
                    Format yang didukung: PDF, DOC, DOCX. Maksimal 5MB
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                :disabled="saving"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {{ saving ? 'Menyimpan...' : 'Simpan' }}
              </button>
              <button
                type="button"
                @click="dialog = false"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { db, storage } from '@/services/firebase'
import { ref as dbRef, push, set, onValue, remove } from 'firebase/database'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import * as XLSX from 'xlsx'

interface SuratMasuk {
  id?: string
  nomor: string
  asal: string
  perihal: string
  tanggalSurat: string
  tanggalDiterima: string
  jenisSurat: string
  sifatSurat: string
  keterangan: string
  fileUrl?: string
  fileName?: string
}

const dialog = ref(false)
const search = ref('')
const loading = ref(true)
const saving = ref(false)
const selectedFile = ref<File | null>(null)
const suratList = ref<SuratMasuk[]>([])

const editedItem = ref<SuratMasuk>({
  nomor: '',
  asal: '',
  perihal: '',
  tanggalSurat: new Date().toISOString().split('T')[0],
  tanggalDiterima: new Date().toISOString().split('T')[0],
  jenisSurat: '',
  sifatSurat: '',
  keterangan: ''
})

const headers = [
  { key: 'nomor', title: 'Nomor Surat' },
  { key: 'asal', title: 'Asal Surat' },
  { key: 'perihal', title: 'Perihal' },
  { key: 'tanggalSurat', title: 'Tanggal Surat' },
  { key: 'tanggalDiterima', title: 'Tanggal Diterima' },
  { key: 'jenisSurat', title: 'Jenis Surat' },
  { key: 'sifatSurat', title: 'Sifat Surat' },
  { key: 'keterangan', title: 'Keterangan' }
]

onMounted(() => {
  loadSuratMasuk()
})

const loadSuratMasuk = () => {
  const suratRef = dbRef(db, 'surat-masuk')
  onValue(suratRef, (snapshot) => {
    suratList.value = []
    snapshot.forEach((child) => {
      suratList.value.push({
        id: child.key,
        ...child.val()
      })
    })
    loading.value = false
  })
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0]
  }
}

const uploadFile = async (file: File): Promise<{ url: string, name: string }> => {
  const fileRef = storageRef(storage, `surat-masuk/${Date.now()}_${file.name}`)
  await uploadBytes(fileRef, file)
  const url = await getDownloadURL(fileRef)
  return { url, name: file.name }
}

const saveSurat = async () => {
  try {
    saving.value = true
    let fileData = {}
    
    if (selectedFile.value) {
      const { url, name } = await uploadFile(selectedFile.value)
      fileData = { fileUrl: url, fileName: name }
    }

    const suratData = {
      ...editedItem.value,
      ...fileData,
      tanggalSurat: new Date(editedItem.value.tanggalSurat).toISOString()
    }

    if (editedItem.value.id) {
      await set(dbRef(db, `surat-masuk/${editedItem.value.id}`), suratData)
    } else {
      await push(dbRef(db, 'surat-masuk'), suratData)
    }

    dialog.value = false
    resetForm()
  } catch (error) {
    console.error('Error saving surat:', error)
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  editedItem.value = {
    nomor: '',
    asal: '',
    perihal: '',
    tanggalSurat: new Date().toISOString().split('T')[0],
    tanggalDiterima: new Date().toISOString().split('T')[0],
    jenisSurat: '',
    sifatSurat: '',
    keterangan: ''
  }
  selectedFile.value = null
}

const viewSurat = (item: SuratMasuk) => {
  if (item.fileUrl) {
    window.open(item.fileUrl, '_blank')
  }
}

const editSurat = (item: SuratMasuk) => {
  editedItem.value = { ...item }
  dialog.value = true
}

const confirmDelete = async (item: SuratMasuk) => {
  if (confirm('Apakah Anda yakin ingin menghapus surat ini?')) {
    try {
      if (item.fileUrl) {
        const fileRef = storageRef(storage, item.fileUrl)
        await deleteObject(fileRef)
      }
      await remove(dbRef(db, `surat-masuk/${item.id}`))
    } catch (error) {
      console.error('Error deleting surat:', error)
    }
  }
}

const exportToExcel = () => {
  const data = suratList.value.map(item => ({
    'Nomor Surat': item.nomor,
    'Asal Surat': item.asal,
    'Perihal': item.perihal,
    'Tanggal Surat': formatDate(item.tanggalSurat),
    'Tanggal Diterima': formatDate(item.tanggalDiterima),
    'Jenis Surat': item.jenisSurat,
    'Sifat Surat': item.sifatSurat,
    'Keterangan': item.keterangan
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Surat Masuk')
  XLSX.writeFile(wb, `surat_masuk_${new Date().toISOString().split('T')[0]}.xlsx`)
}

const filteredSuratList = computed(() => {
  if (!search.value) return suratList.value
  
  const searchLower = search.value.toLowerCase()
  return suratList.value.filter(surat => 
    surat.nomor.toLowerCase().includes(searchLower) ||
    surat.asal.toLowerCase().includes(searchLower) ||
    surat.perihal.toLowerCase().includes(searchLower) ||
    surat.jenisSurat.toLowerCase().includes(searchLower)
  )
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script> 