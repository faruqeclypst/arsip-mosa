<template>
  <div>
    <!-- Header Section -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Disposisi</h1>
        <p class="mt-2 text-sm text-gray-700">Kelola disposisi surat masuk</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button
          @click="dialog = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <i class="fas fa-plus -ml-1 mr-2"></i>
          Tambah Disposisi
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-white shadow-sm rounded-lg">
      <!-- Search and Filter -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-search text-gray-400"></i>
              </div>
              <input
                v-model="search"
                type="text"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Cari disposisi..."
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
              <td colspan="7" class="px-6 py-4">
                <div class="flex items-center justify-center">
                  <i class="fas fa-circle-notch fa-spin text-primary-600 text-2xl"></i>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredDisposisiList.length === 0" class="hover:bg-gray-50">
              <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">
                Tidak ada data disposisi
              </td>
            </tr>
            <tr
              v-for="(item, index) in filteredDisposisiList"
              :key="item.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ suratList.find(s => s.id === item.suratId)?.nomor || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.tujuan }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(item.tanggal) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.sifat }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span
                  :class="{
                    'px-2 py-1 rounded text-xs font-medium': true,
                    'bg-yellow-100 text-yellow-800': item.statusDisposisi === 'Belum Selesai',
                    'bg-green-100 text-green-800': item.statusDisposisi === 'Selesai'
                  }"
                >
                  {{ item.statusDisposisi }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ item.instruksi }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ item.catatan }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  @click="viewDisposisi(item)"
                  class="text-primary-600 hover:text-primary-900"
                  title="Lihat"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  @click="editDisposisi(item)"
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
    <div
      v-if="dialog"
      class="fixed inset-0 z-10 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          @click="dialog = false"
        ></div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="saveDisposisi">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="space-y-4">
                <!-- Nomor Surat -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Pilih Surat
                  </label>
                  <select
                    v-model="editedItem.suratId"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="">Pilih Surat</option>
                    <option 
                      v-for="surat in suratList" 
                      :key="surat.id" 
                      :value="surat.id"
                    >
                      {{ surat.nomor }} - {{ surat.asal }} - {{ surat.perihal }} - {{ surat.jenisSurat }}
                    </option>
                  </select>
                </div>

                <!-- Tujuan -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Tujuan Disposisi
                  </label>
                  <input
                    v-model="editedItem.tujuan"
                    type="text"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Masukkan tujuan disposisi"
                  />
                </div>

                <!-- Isi -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Isi Disposisi
                  </label>
                  <textarea
                    v-model="editedItem.isi"
                    rows="3"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Masukkan isi disposisi"
                  ></textarea>
                </div>

                <!-- Tanggal -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Tanggal
                  </label>
                  <input
                    v-model="editedItem.tanggal"
                    type="date"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <!-- Batas Tanggal -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Batas Waktu
                  </label>
                  <input
                    v-model="editedItem.batasTanggal"
                    type="date"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <!-- Sifat -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Sifat
                  </label>
                  <select
                    v-model="editedItem.sifat"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="">Pilih Sifat</option>
                    <option value="Biasa">Biasa</option>
                    <option value="Segera">Segera</option>
                    <option value="Penting">Penting</option>
                    <option value="Rahasia">Rahasia</option>
                    <option value="Sangat Rahasia">Sangat Rahasia</option>
                  </select>
                </div>

                <!-- Status -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    v-model="editedItem.statusDisposisi"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="Belum Selesai">Belum Selesai</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>

                <!-- Instruksi -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Instruksi
                  </label>
                  <textarea
                    v-model="editedItem.instruksi"
                    rows="3"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Masukkan instruksi disposisi"
                  ></textarea>
                </div>

                <!-- Catatan -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Catatan
                  </label>
                  <textarea
                    v-model="editedItem.catatan"
                    rows="2"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Tambahkan catatan jika ada"
                  ></textarea>
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

    <!-- Modal Detail -->
    <div v-if="showDetail" class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showDetail = false"></div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900">Detail Disposisi</h3>
              
              <div>
                <p class="text-sm font-medium text-gray-500">Nomor Surat</p>
                <p class="mt-1">{{ selectedSurat?.nomor }}</p>
              </div>

              <div>
                <p class="text-sm font-medium text-gray-500">Tujuan</p>
                <p class="mt-1">{{ selectedDisposisi?.tujuan }}</p>
              </div>

              <div>
                <p class="text-sm font-medium text-gray-500">Isi Disposisi</p>
                <p class="mt-1">{{ selectedDisposisi?.isi }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm font-medium text-gray-500">Tanggal</p>
                  <p class="mt-1">{{ selectedDisposisi?.tanggal ? formatDate(selectedDisposisi.tanggal) : '-' }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Batas Waktu</p>
                  <p class="mt-1">{{ selectedDisposisi?.batasTanggal ? formatDate(selectedDisposisi.batasTanggal) : '-' }}</p>
                </div>
              </div>

              <div>
                <p class="text-sm font-medium text-gray-500">Instruksi</p>
                <p class="mt-1">{{ selectedDisposisi?.instruksi }}</p>
              </div>

              <div>
                <p class="text-sm font-medium text-gray-500">Catatan</p>
                <p class="mt-1">{{ selectedDisposisi?.catatan }}</p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
              @click="showDetail = false"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { db } from '@/services/firebase'
import { ref as dbRef, push, set, onValue, remove } from 'firebase/database'
import { utils as XLSXUtils, writeFile as XLSXWriteFile } from 'xlsx'

interface Disposisi {
  id?: string
  suratId: string
  tujuan: string
  isi: string
  sifat: string
  tanggal: string
  batasTanggal: string
  statusDisposisi: string
  instruksi: string
  catatan: string
}

interface SuratMasuk {
  id: string
  nomor: string
  asal: string
  perihal: string
  jenisSurat: string
}

const dialog = ref(false)
const search = ref('')
const loading = ref(true)
const saving = ref(false)
const disposisiList = ref<Disposisi[]>([])
const suratList = ref<SuratMasuk[]>([])

const editedItem = ref<Disposisi>({
  suratId: '',
  tujuan: '',
  isi: '',
  sifat: 'Biasa',
  tanggal: new Date().toISOString().split('T')[0],
  batasTanggal: new Date().toISOString().split('T')[0],
  statusDisposisi: 'Belum Selesai',
  instruksi: '',
  catatan: ''
})

const headers = [
  { key: 'nomor', title: 'Nomor Surat' },
  { key: 'tujuan', title: 'Tujuan' },
  { key: 'tanggal', title: 'Tanggal' },
  { key: 'sifat', title: 'Sifat' },
  { key: 'statusDisposisi', title: 'Status' }
]

const showDetail = ref(false)
const selectedDisposisi = ref<Disposisi | null>(null)

onMounted(() => {
  loadSuratMasuk()
  loadDisposisi()
})

const loadSuratMasuk = () => {
  const suratRef = dbRef(db, 'surat-masuk')
  onValue(suratRef, (snapshot) => {
    suratList.value = []
    snapshot.forEach((child) => {
      suratList.value.push({
        id: child.key as string,
        nomor: child.val().nomor,
        asal: child.val().asal,
        perihal: child.val().perihal,
        jenisSurat: child.val().jenisSurat
      })
    })
  })
}

const loadDisposisi = () => {
  loading.value = true
  const disposisiRef = dbRef(db, 'disposisi')
  onValue(disposisiRef, (snapshot) => {
    disposisiList.value = []
    snapshot.forEach((child) => {
      const disposisi = child.val()
      disposisiList.value.push({
        id: child.key,
        ...disposisi,
      })
    })
    loading.value = false
  })
}

const saveDisposisi = async () => {
  try {
    saving.value = true
    const disposisiData = {
      ...editedItem.value,
      tanggal: new Date(editedItem.value.tanggal).toISOString()
    }

    if (editedItem.value.id) {
      await set(dbRef(db, `disposisi/${editedItem.value.id}`), disposisiData)
    } else {
      await push(dbRef(db, 'disposisi'), disposisiData)
    }

    dialog.value = false
    resetForm()
  } catch (error) {
    console.error('Error saving disposisi:', error)
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  editedItem.value = {
    suratId: '',
    tujuan: '',
    isi: '',
    sifat: 'Biasa',
    tanggal: new Date().toISOString().split('T')[0],
    batasTanggal: new Date().toISOString().split('T')[0],
    statusDisposisi: 'Belum Selesai',
    instruksi: '',
    catatan: ''
  }
}

const viewDisposisi = (item: Disposisi) => {
  selectedDisposisi.value = item
  showDetail.value = true
}

const editDisposisi = (item: Disposisi) => {
  editedItem.value = { 
    ...item,
    tanggal: new Date(item.tanggal).toISOString().split('T')[0]
  }
  dialog.value = true
}

const confirmDelete = async (item: Disposisi) => {
  if (confirm('Apakah Anda yakin ingin menghapus disposisi ini?')) {
    try {
      await remove(dbRef(db, `disposisi/${item.id}`))
    } catch (error) {
      console.error('Error deleting disposisi:', error)
    }
  }
}

const exportToExcel = () => {
  const data = disposisiList.value.map(item => {
    const surat = suratList.value.find(s => s.id === item.suratId)
    return {
      'Nomor Surat': surat?.nomor || '-',
      'Tujuan': item.tujuan,
      'Isi Disposisi': item.isi,
      'Tanggal': formatDate(item.tanggal),
      'Batas Waktu': formatDate(item.batasTanggal),
      'Sifat': item.sifat,
      'Status': item.statusDisposisi,
      'Instruksi': item.instruksi,
      'Catatan': item.catatan
    }
  })

  const ws = XLSXUtils.json_to_sheet(data)
  const wb = XLSXUtils.book_new()
  XLSXUtils.book_append_sheet(wb, ws, 'Disposisi')
  XLSXWriteFile(wb, `disposisi_${new Date().toISOString().split('T')[0]}.xlsx`)
}

const filteredDisposisiList = computed(() => {
  if (!search.value) return disposisiList.value
  
  const searchLower = search.value.toLowerCase()
  return disposisiList.value.filter(disposisi => 
    disposisi.tujuan.toLowerCase().includes(searchLower) ||
    disposisi.isi.toLowerCase().includes(searchLower) ||
    disposisi.sifat.toLowerCase().includes(searchLower)
  )
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const selectedSurat = computed(() => {
  return suratList.value.find(surat => surat.id === editedItem.value.suratId)
})
</script> 